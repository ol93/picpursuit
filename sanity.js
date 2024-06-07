// sanity.js
import {createClient} from '@sanity/client'
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

export const client = createClient({
  projectId: 'kdt18ats',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
})

// uses GROQ to query content: https://www.sanity.io/docs/groq
export async function getAllPhotos() {
  const photos = await client.fetch('*[_type == "Photo"]')
  return photos
}

// get Photos by Category and just image data

// *[CategoryName == 'Animals']{   Photos []->{image} }

// Like this you get the category name and the photos that come with the category. We need it to get the photos by category.

// *[CategoryName == 'Animals']{   Photos []-> }

// get Photos by Photographer and just image data

// *[name == 'Olaf Schaftenaar']{ Photos[] -> {image}  }

// get Photos by Photographer and price data

// *[name == 'Olaf Schaftenaar']{ Photos[] ->   }





export async function getPhotosByPhotographer(PhotoGrapher) {
    const photos = setTimeout(() => {
       client.fetch('*[_type == "post" && references($id)]', {id: PhotoGrapher})
    }, 1000); 
    return photos
    }

export async function getPhotographers() {
  const photographers = await client.fetch('*[_type == "photographer"]')
  return photographers
}