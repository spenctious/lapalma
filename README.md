# La Palma for walkers

A walking guide to the Canary Island of La Palma.

The app is a small data-driven web app that lets users:
- Find out about the island, local transport, the trail network and GPS hiking apps
- Get relevant specific forecasts for various points around the island
- Browse a collection of recommended routes and variations
- Filter routes by various criteria to include or exclude various features, warnings or locations
- See route details including variations, trail images and maps
- Browse points of interest and filter the selection by categories
- See points of interest details and what walks they relate to

Full details of the project including a slideshow of screenshots and a datasheet can be found on my [portfolio site](https://robanstey.netlify.app/index.html#portfolio).

## Cautions

The app data is based on original research conducted in 2017 and a lot has happened since then. There has been a pandemic,
a serious wildfire in the north of the island, and of course the catestrophic eruption on the Cumbre Vieja which has rewritten
much of the geography of the island and rendered many of the central routes invalid. Anyone intending to actually use the
route downloads should check the offical trail website (linked in the app) and local tourist information to verify the route
is still valid before using.

Trail statuses given in the app are fixed snapshot values and should not be taken as the actual live situation. Use the link
to the official trail status page instead.

## Learning tool

The app was concieved and built as a first website to consolidate and expand my knowledge of front-end web techniques newly learnt
through some online courses, the tackling of a reasonably 'meaty' project being considered more likely to be useful in that regard than
something less involved. A lot of the code has been written as a sort of proof-of-concept and then perhaps refactored as new
knowledge became available or just to make it a bit less objectionable.

The app is front-end only which reflects the state of the author's learning at the time rather than what's right. For this reason web-scraping 
the official trail status site proved impossible so it was done once manually and the results served up statically.

## Further development

The author is not likely to do much more to the site except perhaps add the server-side web-scraping code to implement live trail status information
as originally intended. The project could be extended in a number of ways though:

- Adding a map with all the routes on it that could be filtered and explored.
- Integrating Leaflet properly rather than relying on ready-generated maps
- Adding local holiday and fiesta information with notifications (some holidays and events affect specific walks)
- Improving the bus information by reading the PDFs and interpreting the data
- Adding offline map and GPS support. This would be a really big deal for users as there is a significant initial barrier to using offline GPS apps that
puts casual non-technical walkers off.

The project proved to be an excellent learning tool so anyone else looking for a starter project is welcome to grab the resources and have a go at
implementing it themselves.
