---
layout: base.11ty.js
order: 3
outputs: epub
toc: false
---
<section epub:type="titlepage">
    $for(title)$ $if(title.type)$
    <h1 class="$title.type$">$title.text$</h1>
    $else$
    <h1 class="title">$title$</h1>
    $endif$ $endfor$ $if(subtitle)$
    <p class="subtitle">$subtitle$</p>
    $endif$ $for(author)$
    <p class="author">$author$</p>
    $endfor$ $for(creator)$
    <p class="$creator.role$">$creator.text$</p>
    $endfor$ $if(publisher)$
    <p class="publisher">$publisher$</p>
    $endif$ $if(date)$
    <p class="date">$date$</p>
    $endif$ $if(rights)$
    <div class="rights">$rights$</div>
    $endif$
</section>
