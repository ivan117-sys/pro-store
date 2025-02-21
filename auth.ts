import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from "next/headers"

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if(credentials == null) return null;

        // Find user in db
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string
          }
        });

        // Check if user exists and if passwords matches
        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password);

          // Check if password is correnct than return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          }
        }
        // If user does not exists or password does not match return null
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token

      session.user.id = token.sub
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }


      return session
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to the token

      if (user) {
        token.id = user.id
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]

          // Update database to reflect token name
          await prisma.user.update({ 
            where: { id: user.id },
            data: { name: token.name }
           })
        }
        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            // Get the session-based (anonymous) cart
            const sessionCart = await prisma.cart.findUnique({
              where: { id: sessionCartId }
            });
          
            // Check if the logged-in user already has a cart
            const userCart = await prisma.cart.findFirst({
              where: { userId: user.id }
            });
          
            if (sessionCart) {
              if (userCart) {
                // Merge the anonymous cart into the user's existing cart
                await prisma.cart.update({
                  where: { id: userCart.id },
                  data: {
                    items: {
                      push: sessionCart.items // Append guest cart items to user's cart
                    }
                  }
                });
          
                // Delete the old anonymous cart since items are now merged
                await prisma.cart.delete({ where: { id: sessionCart.id } });
              } else {
                // If user has no cart, just assign the guest cart to the user
                await prisma.cart.update({
                  where: { id: sessionCart.id },
                  data: { userId: user.id }
                });
              }
            }
          }
          
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name
      }

      return token
    },
    
  }
} satisfies NextAuthConfig ;

export const {handlers, auth, signIn, signOut} = NextAuth(config);