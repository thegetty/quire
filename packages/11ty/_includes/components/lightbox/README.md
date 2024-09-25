## q-lightbox markup

The code here is largely boilerplate to composite together the various pieces of the lightbox that 11ty knows about and put them in the right web component slots via the `slot` attribute.

The markup is composed of three main parts:
- An embedded script tag containing the data for figures passed to the lightbox component.
	- Figures data is annotated with `src_content` (for figure table HTML content), `caption_html` (markdown-rendered caption), `label_html` (markdown-rendered label), `credit_html` (markdown-rendered credit), and `slugged_id` (figure id slugged) properties to each figure's data.
- An element containing the lightbox UI -- total slides, current slide, next / prev buttons, etc.
- An element containing the lightbox styles (compiled at build time)
