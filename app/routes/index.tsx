import {useLoaderData} from '@remix-run/react'
import * as shopify from '../shopify-client.server'
import {default as cn} from "classnames";

const SHOPIFY_COLLECTION_ID="453072388408"
const VOXMEDIA_COLLECTION_ID="435226542392"
const NOTABLE_WORK_COLLECTION_ID="435288932664"
const CURRENT_PROJECTS_COLLECTION_ID="435291947320"
const MISC_COLLECTION_ID="435340345656"

function collection_fragment(alias, collection_id) {
  return `
    ${alias}:collection(id:"gid://shopify/Collection/${collection_id}") {
      id
      title
      description
      products(first:8, reverse:true) {
        nodes {
          id
          title
          descriptionHtml
          tags
          emoji:metafield(key:"emoji", namespace:"custom") {
            value
          }
        }
      }
    }
  `
}
export const loader: LoaderFunction = async() => {
  const query = String.raw`
    query layout {
      shop {
        name
        description
      }
      ${collection_fragment("shopify", SHOPIFY_COLLECTION_ID)}
      ${collection_fragment("voxmedia", VOXMEDIA_COLLECTION_ID)}
      ${collection_fragment("notable_work", NOTABLE_WORK_COLLECTION_ID)}
      ${collection_fragment("current_projects", CURRENT_PROJECTS_COLLECTION_ID)}
      ${collection_fragment("misc", MISC_COLLECTION_ID)}
    }
  `
  const response = await fetch(shopify.getStorefrontApiUrl(), {
    body: query,
    headers: shopify.getPublicTokenHeaders(),
    method: 'POST',
  });
  const json  = await response.json()
  return json.data
}

const Tags = function({tags,className}) {
  let list = tags.map((tag, i) => {
    return <li key={i} className='text-[.5em] lg:text-[1em] p-2 border-2 border-white  bg-gray-100' >{tag.toLowerCase()}</li>
  })
  return (
    <ul className={cn('mt-5 grid grid-flow-col auto-cols-auto gap-y-3',className)} >
      {list}
    </ul>
  )
}
const Emoji = function({emoji, className}) {
  return (
    <span className={cn("",className)} dangerouslySetInnerHTML={{__html:emoji}}></span>
  )
}


const Highlight = function({item, className}) {
  return (
    <div className={cn('',className)} key='{item.id}'>
      <h3 className='text-base lg:text-xl font-bold'>
      {item.emoji && (<Emoji className='-ml-4 px-2' emoji={item.emoji.value} />)}
      {item.title}
      </h3>
      <div className='highlight pt-2 text-xs lg:text-lg' dangerouslySetInnerHTML={{__html:item.descriptionHtml}}></div>
      <Tags tags={item.tags}/>
    </div>
  )
}

const Experience = function({emoji, showTitle=true, collection, className}) {
  let highlights = collection.products.nodes.map((item) => {
    return (
      <Highlight key={item.id} item={item} />
    )
  })
  let margin_top = "ml-5"
  if (collection.description) {
    margin_top = "mt-8"
  }
  let hn = `lg:ml-2 ${margin_top} flex flex-col space-y-10`
  return (
    <div className={cn("", className)} key={collection.id}>
      {showTitle && (
      <h3 className='font-bold text-base lg:text-xl'>{collection.title}</h3>
      )}
      <p className='pt-2 pb-2 mt-5 text-xs lg:text-base'>{collection.description}</p>
      <div className={cn(hn)}>
        {highlights}
      </div>
    </div>
  )
}

const Title = function({children, className}) {
  return (
    <h1 className={cn('text-4xl lg:text-6xl text-center',className)}>{children}</h1>
  )
}
const Subtitle = function({children, className}) {
  return (
    <h2 className={cn('lg:text-2xl italic text-center p-4',className)}>{children}</h2>
  )
}

const Explainer = function() {
  return (
    <p className='text-xs lg:text-base mb-10 italics text-center'>
      &#128293; This resume is a <a href='/explain-yourself-sir'>Headless Shopify Store</a>.
         Built with <a href='https://shopify.dev/custom-storefronts/react-storefront-kit'>@hydrogen-react</a> and <a href='https://remix.run/'>@remix</a> &#128293;
    </p>
  )
}

export default function Index() {
  const data = useLoaderData()
  return (
    <>
      <header className='mb-10 mt-10'>
        <Explainer />
        <Title>{data.shop.name}</Title>
        <Subtitle>{data.shop.description}</Subtitle>
      </header>
      <main className='mx-2 lg:mx-10'>
        <div className='mx-2 lg:mx-5 flex flex-col space-y-20'>
          <Experience className='-mb-20' collection={data.shopify} />
          <Experience collection={data.voxmedia} />
          <Experience collection={data.current_projects} />
          <Experience collection={data.notable_work} />
          <Experience className='-ml-5' showTitle={false} collection={data.misc} />
        </div>
      </main>
      <footer className='mt-2'>
        <Explainer />
      </footer>
    </>
  );
}
