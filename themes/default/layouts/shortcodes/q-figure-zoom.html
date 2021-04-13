{{ if isset $.Site.Params "imagedir" }}
{{ $.Scratch.Set "imageDir" $.Site.Params.imageDir }}
{{ else }}
{{ $.Scratch.Set "imageDir" "" }}
{{ end }}

{{- $figureId := "" -}}
{{- $modalLink := "" -}}

{{ $errorBadId := dict "shortcode" "q-figure" "message" "The supplied value for `id` does not match an `id` value in your `data/figures.yml` file. Or, if you are not using a `data/figures.yml` file, a value for `src` should also be included in the shortcode, and should match the filename of an image file in your `static/img` directory." "example" "{{< q-figure id=&#34;3.1&#34; >}}<br /><br />{{< q-figure id=&#34;3.1&#34; src=&#34;fig-3-1-duchamp.jpg&#34; >}}" }}

{{ $errorNoMediaType := dict "shortcode" "q-figure" "message" "For multimedia figures, the `media_type` attribute must be included in your `data/figures.yml` file for this figure `id`, and must be either “youtube”, “vimeo” or “website”." "example" "- id: &#34;3.1&#34;<br />  media_id: &#34;VYqDpNmnu8I&#34;<br />  media_type: &#34;youtube&#34;" }}

{{ $errorNoSourceNoId := dict "shortcode" "q-figure" "message" "This shortcode must include a value for `src` that matches the filename of an image in your `static/img` directory; or a value for `id` that matches an `id` value in your `data/figures.yml` file." "example" "{{< q-figure id=&#34;3.1&#34; >}}<br /><br />{{< q-figure id=&#34;3.1&#34; src=&#34;fig-3-1-duchamp.jpg&#34; >}}" }}

<figure class="quire-figure">

{{ if .Get "src" }}
{{/* -------------------- BEGIN SRC BLOCK -------------------- */}}
{{/*
----------------------------------------------------------------------------
If the shortcode has a src, ignore any figures.yml
document and render only the values given in the shortcode
----------------------------------------------------------------------------
*/}}

{{ if eq $.Site.Params.figureModal true }}

<div class="q-figure__wrapper">

{{ if eq (.Get "media_type") "map" }}

{{ $figureId = printf "%s-%d" "map" now.UnixNano }}
{{ $modalLink = printf "%s%s" "#" $figureId }}

    <figure       
      id="{{ $figureId }}"
      {{ if .Get "caption" }} title='{{ .Get "caption" | markdownify | safeHTML }}' {{ end }} 
      class="quire-figure leaflet-outer-wrapper mfp-hide">
      <div 
        id="js-{{ $figureId }}" 
        class="quire-map leaflet-inner-wrapper inset"
        {{ with .Get "lat" }}data-lat="{{.}}"{{ end }}
        {{ with .Get "long" }}data-long="{{.}}"{{ end }}
        {{ if .Get "geojson" }}data-geojson="{{ .Site.BaseURL }}{{ .Get "geojson" }}"{{ end }}>
      </div>
    </figure>

  {{/* -------------------- BEGIN FIGURE MODAL WRAPPER -------------------- */}}
    <a 
    href="{{ $modalLink }}"     
    class='inline popup'
    data-type="inline" 
    title='{{ .Get "caption" | markdownify | safeHTML }}'>
    <img
      id='{{ with .Get "id" }}{{ . | urlize }}{{ end }}'
      class="quire-figure__image" 
      src='{{ with .Get "src"}}{{ printf "%s/%s" ($.Scratch.Get "imageDir") . | relURL }}{{ end }}'
      alt='{{ with .Get "alt" }}{{ . }}{{ end }}' />
      

{{ else if eq (.Get "media_type") "iiif" }}

{{ $figureId = printf "%s-%d" "iiif" now.UnixNano }}
{{ $modalLink = printf "%s%s" "#" $figureId }}

    <figure    
      id="{{ $figureId }}" 
      {{ if .Get "caption" }}  title='{{ .Get "caption" | markdownify | safeHTML }}' {{ end }} 
      class="quire-figure leaflet-outer-wrapper mfp-hide">
        <div 
          id="js-{{ $figureId }}" 
          class="quire-deepzoom inset leaflet-inner-wrapper" 
          aria-live="polite" 
          role="application" 
          aria-label="Zoomable image" 
          {{ if .Get "iiif" }} data-iiif="{{ .Get "iiif" }}" {{ end }}
          {{ if .Get "zoom_max" }} data-zoom-max="{{ .Get "zoom_max" }}" {{ end }}
        >
        </div>
      </figure>

    <a
    href="{{ $modalLink }}" 
    class='inline popup'
    data-type='inline' 
    {{ if .Get "caption" }}  title='{{ .Get "caption" | markdownify | safeHTML }}' {{ end }}>
      <img
      id='{{ with .Get "id" }}{{ . | urlize }}{{ end }}'
      class="quire-figure__image" 
      src='{{ with .Get "src"}}{{ printf "%s/%s" ($.Scratch.Get "imageDir") . | relURL }}{{ end }}'
      alt='{{ with .Get "alt" }}{{ . }}{{ end }}' />

{{ else }}

{{ $figureId = printf "%s-%d" "deepzoom" now.UnixNano }}
{{ $modalLink = printf "%s%s" "#" $figureId }}

  <figure   
  id="{{ $figureId }}" 
  {{ if .Get "caption" }}  
  title='{{ .Get "caption" | markdownify | safeHTML }}' {{ end }} 
  class="quire-figure leaflet-outer-wrapper mfp-hide">
    <div 
      id="js-{{ $figureId }}" 
      class="quire-deepzoom inset leaflet-inner-wrapper " 
      aria-live="polite" 
      role="application" 
      aria-label="Zoomable image" 
      {{ if .zoom_max }} data-zoom-max="{{ .zoom_max }}" {{ end }}
      src="{{ with .Get "src"}}{{ printf "%s/%s" ($.Scratch.Get "imageDir") . | relURL }}{{ end }}">
    </div>
  </figure>

  <a
    href="{{ $modalLink }}" 
    class='inline popup'
    data-type='inline' 
    {{ if .Get "caption" }}  title='{{ .Get "caption" | markdownify | safeHTML }}' {{ end }}>
    <img
      id='{{ with .Get "id" }}{{ . | urlize }}{{ end }}'
      class="quire-figure__image" 
      src='{{ with .Get "src"}}{{ printf "%s/%s" ($.Scratch.Get "imageDir") . | relURL }}{{ end }}'
      alt='{{ with .Get "alt" }}{{ . }}{{ end }}' />

{{ end }}

{{/* -------------------- else for modal -------------------- */}}
{{ else }}
{{/* -------------------- else for modal -------------------- */}}

{{ if ne $.Site.Params.pdf true }}

{{ if eq (.Get "media_type") "map" }}

<div 
  id="js-map-{{ now.UnixNano }}" 
  class="no-popup-quire-map quire-map inset" 
  {{ with .Get "lat" }} data-lat="{{.}}" {{ end }}
  {{ with .Get "long" }} data-long="{{.}}" {{ end }} 
  {{ if .Get "geojson" }} data-geojson="{{ .Site.BaseURL }}{{ .Get "geojson" }}" {{ end }}>
</div>

{{ else if eq (.Get "media_type") "iiif" }}

<div
 id="js-iiif-{{ now.UnixNano }}" 
 class="quire-deepzoom inset no-popup-quire-deepzoom" 
 aria-live="polite" 
 role="application" 
 aria-label="Zoomable image" 
 {{ if .Get "iiif" }} data-iiif="{{ .Get "iiif" }}" {{ end }}
 {{ if .Get "zoom_max" }} data-zoom-max="{{ .Get "zoom_max" }}" {{ end }}
 >
</div>

{{ else }}

<div 
 id="js-deepzoom-{{ now.UnixNano }}" 
 class="quire-deepzoom inset no-popup-quire-deepzoom" 
 aria-live="polite" 
 role="application" 
 aria-label="Zoomable image" 
 src='{{ with .Get "src"}}{{ printf "%s/%s" ($.Scratch.Get "imageDir") . | relURL }}{{ end }}'
 {{ if .Get "zoom_max" }} data-zoom-max="{{ .Get "zoom_max" }}" {{ end }}
 >
</div>
    
{{ end }}

{{ else }}
<img
id='{{ with .Get "id" }}{{ . | urlize }}{{ end }}'
class="quire-figure__image" 
src='{{ with .Get "src"}}{{ printf "%s/%s" ($.Scratch.Get "imageDir") . | relURL }}{{ end }}'
alt='{{ with .Get "alt" }}{{ . }}{{ end }}' />

{{ end }}

{{ end }}

{{/* -------------------- BEGIN TOP LABEL BLOCK -------------------- */}}

{{- if or .label (eq $.Site.Params.figureModal true ) }}
  {{ if eq $.Site.Params.figureLabelLocation "on-top" }}
    {{- $labelDict := dict "Site" $.Site "label" .label -}}
    {{- partial "figures/label.html" $labelDict -}}
  {{ end }}
{{- end -}}
{{/* -------------------- END TOP LABEL BLOCK -------------------- */}}

{{ if eq $.Site.Params.figureModal true }}
  </a>
{{ end }}
{{/* -------------------- END FIGURE MODAL WRAPPER -------------------- */}}

{{/* -------------------- BEGIN CAPTION BLOCK -------------------- */}}
{{- $captionDict := dict "Site" $.Site "caption" .caption "credit" .credit "label" .label "modalLink" $modalLink -}}

{{- partial "figures/caption.html" $captionDict -}}
{{/* -------------------- END CAPTION BLOCK -------------------- */}}

{{ if eq $.Site.Params.figureModal true }}
  </div>
{{ end }}

{{/* -------------------- else for src or id -------------------- */}}
{{ else if .Get "id" }}
{{/* -------------------- else for src or id -------------------- */}}

{{ $x := .Get "id" | string }}
{{ $fig := len (where .Site.Data.figures.figure_list "id" "eq" $x) }}

{{ if eq $fig 0 }}
  {{ partial "error-message.html" $errorBadId }}
{{ else }}

{{ range where .Site.Data.figures.figure_list "id" "eq" $x }}

{{ if eq $.Site.Params.figureModal true }}

<div class="q-figure__wrapper">

{{ if eq .media_type "map"  }}

{{ $figureId = printf "%s-%d" "map" now.UnixNano }}
{{ $modalLink = printf "%s%s" "#" $figureId }}

      <figure 
        id="{{ $figureId }}" 
        {{ if .caption }} title='{{ .caption | markdownify | safeHTML }}' {{ end }} 
        class="quire-figure leaflet-outer-wrapper mfp-hide">
        <div 
          id="js-{{ $figureId }}" 
          class="quire-map leaflet-inner-wrapper inset" 
          data-lat="{{ .lat }}"
          data-long="{{ .long }}" 
          data-geojson="{{ .Site.BaseURL }}{{ .geojson }}">
        </div>
      </figure>

      <a 
        href="{{ $modalLink }}" 
        class='inline popup'
        data-type="inline"
        {{ if .caption }} title='{{ .caption | markdownify | safeHTML }}' {{ end }}>
        <img
          id='{{ .id }}'
          class="quire-figure__image" 
          src='{{ printf "%s/%s" ($.Scratch.Get "imageDir") .src | relURL }}' />

{{ else if eq .media_type "iiif" }}

{{ $figureId = printf "%s-%d" "iiif" now.UnixNano }}
{{ $modalLink = printf "%s%s" "#" $figureId }}

  <figure 
    id="{{ $figureId }}" 
    {{ if .caption }} title='{{ .caption | markdownify | safeHTML }}' {{ end }} 
    class="quire-figure leaflet-outer-wrapper mfp-hide">
    <div 
      id="js-{{ $figureId }}" 
      class="quire-deepzoom inset leaflet-inner-wrapper" 
      aria-live="polite" 
      role="application" 
      aria-label="Zoomable image" 
      data-iiif="{{ .iiif }}" 
      {{ if .zoom_max }} data-zoom-max="{{ .zoom_max }}" {{ end }}>
    </div>
  </figure>

  <a
    class='inline popup'
    href="{{ $modalLink }}"
    data-type='inline'
    {{ if .caption }} title='{{ .caption | markdownify | safeHTML }}' {{ end }}>
    <img
      id='{{ .id }}'
      class="quire-figure__image" 
      src='{{ printf "%s/%s" ($.Scratch.Get "imageDir") .src | relURL }}' />

{{ else }}

{{ $figureId = printf "%s-%d" "deepzoom" now.UnixNano }}
{{ $modalLink = printf "%s%s" "#" $figureId }}

    <figure 
      id="{{ $figureId }}"
      {{ if .caption }} title='{{ .caption | markdownify | safeHTML }}' {{ end }}  
      class="quire-figure leaflet-outer-wrapper mfp-hide hi">
        <div 
          id="js-{{ $figureId }}" 
          class="quire-deepzoom inset leaflet-inner-wrapper " 
          aria-live="polite" 
          role="application"
          aria-label="Zoomable image" 
          src="{{ printf "%s/%s" ($.Scratch.Get "imageDir") .src | relURL }}">
        </div>
    </figure>

    <a
      href="{{ $modalLink }}"
      class='inline popup'
      data-type='inline'
      {{ if .caption }} title='{{ .caption | markdownify | safeHTML }}' {{ end }}>
      <img
        id='{{ .id }}'
        class="quire-figure__image" 
        src='{{ printf "%s/%s" ($.Scratch.Get "imageDir") .src | relURL }}' />

{{ end }}

{{/* -------------------- else for modal -------------------- */}}
{{ else }}
{{/* -------------------- else for modal -------------------- */}}

{{ if ne $.Site.Params.pdf true }}
{{ if eq .media_type "map"  }}

  <div 
    id="js-map-{{ now.UnixNano }}" 
    class="no-popup-quire-map quire-map inset" 
    data-lat="{{ .lat }}"
    data-long="{{ .long }}" 
    data-geojson="{{ .Site.BaseURL }}{{ .geojson }}">
  </div>

{{ else if eq .media_type "iiif" }}

  <div 
    id="js-iiif-{{ now.UnixNano }}" 
    {{ if .caption }} title='{{ .caption | markdownify | safeHTML }}' {{ end }} 
    data-iiif="{{ .iiif }}" 
    {{ if .zoom_max }} data-zoom-max="{{ .zoom_max }}" {{ end }}
    class="no-popup-quire-deepzoom quire-deepzoom inset" 
    aria-live="polite" 
    role="application" 
    aria-label="Zoomable image">
   </div>

{{ else }}

  <div 
    id="js-deepzoom-{{ now.UnixNano }}" 
    class="no-popup-quire-deepzoom  quire-deepzoom inset inline" 
    aria-live="polite" 
    role="application" 
    aria-label="Zoomable image" 
    {{ if .zoom_max }} data-zoom-max="{{ .zoom_max }}" {{ end }}
    src='{{ printf "%s/%s" ($.Scratch.Get "imageDir") .src | relURL }}'>
  </div>

{{ end }}

{{ else }}

<img
id='{{ .id }}'
class="quire-figure__image" 
src='{{ printf "%s/%s" ($.Scratch.Get "imageDir") .src | relURL }}' />

{{ end }}

{{ end }}

{{/* -------------------- BEGIN LABEL BLOCK -------------------- */}}
{{- if or .label (eq $.Site.Params.figureModal true ) }}
  {{ if eq $.Site.Params.figureLabelLocation "on-top" }}
    {{- $labelDict := dict "Site" $.Site "label" .label -}}
    {{- partial "figures/label.html" $labelDict -}}
  {{ end }}
{{- end -}}
{{/* -------------------- END LABEL BLOCK -------------------- */}}

{{ if eq $.Site.Params.figureModal true }}
  </a>
{{ end }}
{{/* -------------------- END FIGURE MODAL WRAPPER -------------------- */}}

{{/* -------------------- BEGIN CAPTION BLOCK AND BELOW LABELING -------------------- */}}
{{- $dict := dict "Site" $.Site "caption" .caption "credit" .credit "label" .label "modalLink" $modalLink -}}

{{- partial "figures/caption.html" $dict -}}
{{/* -------------------- END CAPTION BLOCK AND BELOW LABELING -------------------- */}}

{{ if eq $.Site.Params.figureModal true }}
  </div>
{{ end }}

{{ end }}

{{ end }}

{{ else }}
{{/* -------------------- BEGIN ERROR BLOCK -------------------- */}}
{{/*
----------------------------------------------------------------------------
If the shortcode has no src, and no id, post an error message.
----------------------------------------------------------------------------
*/}}

{{ partial "error-message.html" $errorNoSourceNoId }}

{{/* -------------------- END ERROR BLOCK -------------------- */}}
{{ end }}

</figure>
