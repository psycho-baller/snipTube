# SnipTube

## Development

To run the browser extension, run `yarn dev` in the sniptube folder (`cd sniptube`)

To run the backend, run `uvicorn main:app --reload` in the backend folder (`cd backend`)

## TODO

* [X] add sass and style the snips
* [X] make everything get updated instantly (e.g: when we make a new snip, reflect that in the video bar)
* [X] build the popup.tsx file
* [ ] style the tags in the popup and put them in tab 2 too
* [ ] make the tags clickable in the popup and make them filter the snips
* [ ] add notes and play button for both tabs
* [X] add a delete button for the snips
* [ ] add a way users can change the name (AI generated title) of the snip
  * [ ] before submitting the snip
  * [ ] after submitting the snip (in the popup)
* [X] Try out [plasmo](https://www.plasmo.com/)
* [ ] Investigate different OSS LLMs to see which one is the best for this project
* [ ] The snip summary now has context to the whole video instead of just the snip

