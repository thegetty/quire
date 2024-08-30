## q-lightbox markup

The javascript in this folder generates the markup for the q-lightbox component. The markup is composed of three main parts:
- An embedded script tag containing the data for figures passed to the lightbox component.
	- Figures data is annotated with `src_content` (for figure table HTML content), `caption_html` (markdown-rendered caption), `label_html` (markdown-rendered label), `credit_html` (markdown-rendered credit), and `slugged_id` (figure id slugged) properties to each figure's data.
- An element containing the figure slides themselves. These are serialized at build time into the div.
- An element containing the lightbox UI -- total slides, current slide, next / prev buttons, etc.
