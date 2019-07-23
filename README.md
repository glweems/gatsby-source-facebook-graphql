# Gatsby-source-facebook-graphql

A Gatsby source plugin for sourcing data into your Gatsby application from Facebooks graph API.

## Install

`npm install --save gatsby-source-facebook`

or

`yarn add gatsby-source-facebook-graphql`

## How to use:

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-facebook-graphql`,
      options: {
        // Facebook account or page ID
        pageId: 1690402924350633,
        params: {
          fields: [
            'about',
            'bio',
            'category',
            'category_list',
            'company_overview',
            'features',
            'hours',
            'phone',
            'location',
            'username',
            'description',
            'products',
            'photos{webp_images}',
            'rating_count',
            'place_type',
          ],
        },
        // Settings are optional
        settings: {
          timeout: 3000,
          pool: { maxSockets: Infinity },
          headers: { connection: 'keep-alive' },
        },
        // Access Token from facebook
        accessToken: process.env.GATSBY_FACEBOOK_GRAPH_TOKEN,
      },
    },
  ],
}
```
