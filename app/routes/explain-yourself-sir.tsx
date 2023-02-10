import {useLoaderData} from '@remix-run/react'
import * as shopify from '../shopify-client.server'
import {default as cn} from "classnames";
const BLOG_POST_PRODUCT_ID="8106994991416"

export const loader: LoaderFunction = async() => {
  const query = String.raw`
    query layout {
			product(id:"gid://shopify/Product/${BLOG_POST_PRODUCT_ID}") {
				title
				descriptionHtml
			}
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

export default function Post() {
  const data = useLoaderData()
	const item = data.product
	return (
		<div className='px-10'>
			<h1 className='mt-10 mb-10 text-3xl lg:text-6xl text-center'>
				<a href='/'>{item.title}</a>
			</h1>
			<div className='pt-2 text-lg' dangerouslySetInnerHTML={{__html:item.descriptionHtml}}></div>
		</div>
	)
}
