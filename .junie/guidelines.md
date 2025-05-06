# Problem to be solved

Websites with the amazon.co.jp domain (henceforth referred to as Amazon) have multiple URLs pointing to the same web page, depending on how they were accessed. When you want to introduce Amazon's page to others, you may copy and paste the address bar of Chrome, but in some cases, you may end up sharing a long URL, which is difficult for both parties to understand.

So, you can always display the same URL in the address bar by controlling it with Chrome Extensions.


# Chrome Extension Features

- When accessing Amazon, the process is branched depending on whether the regular expression `https://www.amazon.co.jp/dp/<ASIN>` matches “the shortest Amazon URL format” or not.
    - If a match is found, nothing is done.
    - If there is no match, check if the regular expression matches the pattern described in “About Amazon URL format patterns” below.
        - If it matches “About Amazon's URL format pattern”, redirect to `https://www.amazon.co.jp/dp/<ASIN>` style URL.
        - If it does not match “About Amazon's URL format pattern”, nothing is done.

# About Amazon's URL format patterns

According to [source](https://unoh.github.io/2008/03/25/amazonurlasin.html), the following patterns are possible. The `<ASIN>` part is set to a different ASIN or ISBN value for each product.

- `https://www.amazon.co.jp/exec/obidos/ASIN/<ASIN>`
- `https://www.amazon.co.jp/o/ASIN/<ASIN>`
- `https://www.amazon.co.jp/exec/obidos/ISBN=<ASIN>`
- `https://www.amazon.co.jp/exec/obidos/ISBN%3D<ASIN>`
- `https://www.amazon.co.jp/o/ISBN=<ASIN>`
- `https://www.amazon.co.jp/exec/obidos/tg/detail/-/<ASIN>`
- `https://www.amazon.co.jp/exec/obidos/tg/detail/-/Elements-Style/<ASIN>`
- `https://www.amazon.co.jp/o/tg/detail/-/<ASIN>`
- `https://www.amazon.co.jp/o/tg/detail/-/Elements-Style/<ASIN>`
- `https://www.amazon.co.jp/gp/product/<ASIN>`
- `https://www.amazon.co.jp/gp/product/product-description/<ASIN>`
- `https://www.amazon.co.jp/dp/<ASIN>`
- `https://www.amazon.co.jp/Elements-Style/dp/<ASIN>`
- `https://www.amazon.co.jp/Elements-Style/dp/product-description/<ASIN>`
- `https://www.amazon.co.jp/%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0Rust-%E7%AC%AC2%E7%89%88-Jim-Blandy/dp/< ASIN>`


# Expectations regarding the behavior of the Chrome extension

We expect the following table to work

|Number|URL|Behavior|
|---|---|---|
|1|Redirect to https://www.amazon.co.jp/exec/obidos/ASIN/020530902X|`https://www.amazon.co.jp/dp/020530902X`|
|2|Redirect to https://www.amazon.co.jp/o/ASIN/020530902X|`https://www.amazon.co.jp/dp/020530902X`|
|3|Redirect to `https://www.amazon.co.jp/exec/obidos/ISBN=020530902X|`https://www.amazon.co.jp/dp/020530902X`|
|4|https://www.amazon.co.jp/exec/obidos/ISBN%3D020530902X|Redirect to `https://www.amazon.co.jp/dp/020530902X`|
|5|https://www.amazon.co.jp/o/ISBN=020530902X|`Redirect to https://www.amazon.co.jp/dp/020530902X`|
|6|https://www.amazon.co.jp/exec/obidos/tg/detail/-/020530902X|`Redirect to https://www.amazon.co.jp/dp/020530902X`|
|7|Redirect to `https://www.amazon.co.jp/exec/obidos/tg/detail/-/Elements-Style/020530902X|`https://www.amazon.co.jp/dp/020530902X`|
|8|https://www.amazon.co.jp/o/tg/detail/-/020530902X|`Redirect to https://www.amazon.co.jp/dp/020530902X`|
|9|Redirect to `https://www.amazon.co.jp/o/tg/detail/-/Elements-Style/020530902X|`https://www.amazon.co.jp/dp/020530902X`|
|10|Redirect to `https://www.amazon.co.jp/gp/product/020530902X|`https://www.amazon.co.jp/dp/020530902X`|
|11|https://www.amazon.co.jp/gp/product/product-description/020530902X|Redirect to `https://www.amazon.co.jp/dp/020530902X`|
|12|https://www.amazon.co.jp/dp/020530902X|Do nothing|
|13|https://www.amazon.co.jp/Elements-Style/dp/020530902X|Redirect to `https://www.amazon.co.jp/dp/020530902X`|
|14|https://www.amazon.co.jp/Elements-Style/dp/product-description/020530902X|Redirect to `https://www.amazon.co.jp/dp/020530902X`|
|15|https://www.amazon.co.jp/%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0Rust-%E7%AC%AC2%E7%89%88-Jim-Blandy/dp /4873119782/|Redirect to ``https://www.amazon.co.jp/dp/020530902X``|
|16|https://www.amazon.co.jp/s?k=%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0+rust+%E7%AC%AC2%E7%89%88|Do nothing|
|17|https://www.amazon.co.jp/dp/B09KZJXDN1?tag=hatena-22&linkCode=osi&th=1&psc=1/|Redirect to `https://www.amazon.co.jp/dp/B09KZXDN1`|