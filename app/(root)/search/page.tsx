import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import { getAllProducts, getAllCategories } from "@/lib/actions/product.actions";
import Link from "next/link";

const prices = [
  {
    name: '$1 to $50',
    value: '1-50'
  },
  {
    name: '$51 to $100',
    value: '51-100'
  },
  {
    name: '$101 to $200',
    value: '101-200'
  },
  {
    name: '$201 to $500',
    value: '201-500'
  },
  {
    name: '$501 to $1000',
    value: '501-1000'
  },
];

const sortOrders = ['newest', 'lowest', 'highest', 'rating']

const ratings = [4,3,2,1];

export async function generateMetaData(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>
}) {

  const { 
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all'
   } = await props.searchParams;

   const isQuerySet = q && q !== 'all' && q.trim() !== '';
   const isCategorySet = category && category !== 'all' && category.trim() !== '';
   const isPriceSet = price && price !== 'all' && price.trim() !== '';
   const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

   if(isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ''} 
      ${isCategorySet ? `: Category ${category}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}`
    };
  } else {
      return {
        title: 'Search',
      }
      
    }
   }



const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>
}) => {

  const { 
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
   } = await props.searchParams

  //  Construct filter url
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg
  }: {
    c?: string
    s?: string
    p?: string
    r?: string
    pg?: string
  }) => {

    const params = {q, category, price, rating, sort, page};

    if(c) params.category = c;
    if(s) params.sort = s;
    if(p) params.price = p;
    if(r) params.rating = r;
    if(pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  }

   const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page)

   })

   const categories = await getAllCategories();

  return ( <div className="grid md:grid-cols-5 md:gap-5">
    <div className="filter-links">
      {/* Category Links */}
      <div className="text-xl-mb-2 mt-3">Department</div>
      <div>
        <ul className="space-y-1">
          <li>
            <Link href={getFilterUrl({c: 'all'})} className={`${(category === 'all' || category === '') && 'font-bold'}`}>
            Any
            </Link>
          </li>
          { categories.map((x) => (
            <li key={x.category}>
              <Link href={getFilterUrl({c: x.category})} className={`${category === x.category && 'font-bold'}`}>
              { x.category }
              </Link>
            </li>
          )) }
        </ul>
      </div>
      {/* Price Links */}
      <div className="text-xl-mb-2 mt-8">Price</div>
      <div>
        <ul className="space-y-1">
          <li>
            <Link href={getFilterUrl({p: 'all'})} className={`${category === 'all' }`}>
            Any
            </Link>
          </li>
          { prices.map((p) => (
            <li key={p.value}>
              <Link href={getFilterUrl({p: p.value})} className={`${price === p.value && 'font-bold'}`}>
              { p.name }
              </Link>
            </li>
          )) }
        </ul>
      </div>
        {/* Rating Links */}
      <div className="text-xl-mb-2 mt-8">Customer ratings</div>
      <div>
        <ul className="space-y-1">
          <li>
            <Link href={getFilterUrl({r: 'all'})} className={`${rating === 'all' && 'font-bold' }`}>
            Any
            </Link>
          </li>
          { ratings.map((r) => (
            <li key={r}>
              <Link href={getFilterUrl({r: `${r}`})} className={`${rating === r.toString() && 'font-bold'}`}>
              { `${r} starts & up` }
              </Link>
            </li>
          )) }
        </ul>
      </div>
    </div>
    <div className="md:col-span-4 space-y-4">
      <div className="flex-between flex-col my-4 md:flex-row">
        <div className="flex items-center">
          { q !== 'all' && q !== '' && 'Query: ' + q }
          { category !== 'all' && category !== '' && ' Category: ' + category }
          { price !== 'all' && ' Price: ' + price }
          { rating !== 'all' && ' Rating: ' + rating + ' stars & up'}
          &nbsp;
          { 
          (q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          rating !== 'all' ||
          price !== 'all' ? 
          (<Button asChild variant={'link'}>
            <Link href='/search'>Clear</Link>
          </Button>) : null
           }
        </div>
        <div>

        Sort by{' '}
        { sortOrders.map((s) => (
          <Link key={s} className={`mx-2 ${ sort == s && 'font-bold' }`} href={getFilterUrl({s})} >
            { s }
          </Link>
        )) }

        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        { products.data.length === 0 && <div> No products found </div> }
        { products.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        )) }
      </div>
    </div>
  </div> );
}
 
export default SearchPage;