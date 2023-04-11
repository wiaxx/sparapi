# sparapi

An API that takes a swedish personal identity number and responds with information gathered from SPAR.

## How to get started

Copy the content from `.env.example` to `.env` and modify to suit your local environment.
You need to have certificates to communicate with the SPAR test registry.

In the project directory, you can run:

## `npm start`

Use the API and send a post request to http://localhost:{PORT}/people/search with "pin" in body.

{
    "pin": "{personal identity number}"
}