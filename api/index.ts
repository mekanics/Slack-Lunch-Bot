import { VercelRequest, VercelResponse } from '@vercel/node'
import createFetch from '@vercel/fetch'

const fetch = createFetch()

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!

let lastPlaces: string[] = []

export default async (_req: VercelRequest, res: VercelResponse) => {
	const restaurants = await getRestaurants()
	let randomRestaurant: Place
	const maxRetry = 5
	let retry = 1

	do {
		randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)]
		++retry
	} while ((!randomRestaurant.place_id || lastPlaces.includes(randomRestaurant.place_id)) && retry <= maxRetry)

	if (randomRestaurant.place_id) {
		lastPlaces.push(randomRestaurant.place_id)
		lastPlaces = lastPlaces.slice(-5)
	}

	return res.json(createSlackresponse(randomRestaurant))
}

const getRestaurants = async () => {
	const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'

	const params = new URLSearchParams({
		type: 'restaurant',
		key: GOOGLE_API_KEY,
		radius: '500',
		location: '47.38435474299604,8.528954185206228',
		opennow: 'true',
	})

	const res = await fetch(`${url}?${params.toString()}`)
	const json = await res.json()

	const restaurants: Place[] = (json.results as Place[]) || []

	return restaurants
}

const createSlackresponse = ({ place_id, name, icon, rating }: Place) => {
	// return {
	// 	response_type: 'in_channel',
	// 	text: `Let's eat at ${restaurant.name}`,
	// }

	return {
		response_type: 'in_channel',
		blocks: [
			{
				type: 'section',
				block_id: 'section567',
				text: {
					type: 'mrkdwn',
					text: `Let's eat at <https://www.google.com/maps/place/?q=place_id:${place_id}|${name}>`,
				},
				// accessory: {
				// 	type: 'image',
				// 	image_url: `${icon}`,
				// 	alt_text: `${name}`,
				// },
			},
		],
	}
}

interface Place {
	business_status?: BusinessStatus
	geometry?: Geometry
	icon?: string
	icon_background_color?: string
	icon_mask_base_uri?: string
	name?: string
	opening_hours?: OpeningHours
	photos?: Photo[]
	place_id?: string
	plus_code?: PlusCode
	rating?: number
	reference?: string
	scope?: Scope
	types?: string[]
	user_ratings_total?: number
	vicinity?: string
	price_level?: number
}

enum BusinessStatus {
	Operational = 'OPERATIONAL',
}

interface Geometry {
	location?: Location
	viewport?: Viewport
}

interface Location {
	lat?: number
	lng?: number
}

interface Viewport {
	northeast?: Location
	southwest?: Location
}

interface OpeningHours {
	open_now?: boolean
}

interface Photo {
	height?: number
	html_attributions?: string[]
	photo_reference?: string
	width?: number
}

interface PlusCode {
	compound_code?: string
	global_code?: string
}

enum Scope {
	Google = 'GOOGLE',
}
