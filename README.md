# scrap.tf-item-information

_____________________________________________
This is an userscript to add Backpack.tf and Marketplace.tf links in a menu when middle clicking items on scrap.tf

Currently options of the menu are:

* Item History
* Check Classifieds
* Check Classifieds (Accurate)
* Premium Search
* Premium Search (Accurate)
* Item on Marketplace.tf

## Installation

_____________________________________________
Use an extension which can execute userscripts (F.e. [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) for [Chrome](https://www.google.com/chrome/) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)  for [Firefox](https://www.mozilla.org/firefox))
and then install using this link: [scrap.tf-item-information.user.js](https://github.com/NetroScript/scrap.tf-item-information/raw/master/scrap.tf-item-information.user.js).

(Or paste / install it manually for your plugin)

## Changelog

_____________________________________________

### 0.1

* Released

#### 0.1.1

Fixed:

* When extracting the level of an item only the first number was extracted

#### 0.1.2

Fixed:

* Works with the most recent backpack.tf Update [08.12.2017] (Changes to Skin Search, now you can also find war paints)

#### 0.1.3

Added:

* Search for an item on the Steam Community Market

#### 0.1.4

Updated:

* Updated defindex item name list to 03.01.2018

Fixed:

* Fall back to the name on scrap.tf if there is no known name for the defindex

#### 0.1.5

Updated:

* Updated defindex item name list to 09.05.2018

Fixed:

* Wrong URL syntax for skins when generating a marketplace.tf link

#### 0.1.6

Updated:

* Updated defindex item name list to 16.11.2018

Fixed:

* Requiring own JQuery version after scrap.tf changed their used version, so it still works

#### 0.1.7

Fixed:

* Changed Grant so that the older JQuery version does not overwrite the JQuery version of the page

#### 0.1.8

Updated:

* Updated defindex item name list to 05.06.2020

Fixed:

* Formatting
* Updated libraries
* Now also changed items (like in auctions) still open the context menu

#### 0.1.9

Added:

* A basic version of the middle mouse menu now works on the scrap.tf/items page

Updated:

* Updated defindex item name list to 07.11.2021

Improved:

* Added australium support for marketplace.tf links
* Handling of unusual decorated items on backpack.tf (don't enforce a quality anymore)

#### 0.1.10

Updated:

* Updated defindex item name list to 11.05.2023

#### 0.1.11

Updated:

* Updated defindex item name list to 15.07.2023

#### 0.1.12

Added:

* Additional entry for stntrading.eu

Fixed:

* Special Handling for the Haunted Ghosts War Paint
* Australiums working correctly for Steam Community Market links

## Planned features

_____________________________________________

/

## Disclaimer

_____________________________________________

Should an administrator of scrap.tf feel that this extension shouldn't be used, leave me a message on github (with proof that you are an adminstrator) and I will remove this extension from github.

## Preview

_____________________________________________

![Preview](https://raw.githubusercontent.com/NetroScript/scrap.tf-item-information/master/preview.png)

In the order of the menu, the created links are:

* <https://backpack.tf/item/6337300606>
* <https://backpack.tf/classifieds?item=Barnstormer&quality=5&australium=-1&killstreak_tier=0&particle=31>
* <https://backpack.tf/classifieds?item=Barnstormer&quality=5&australium=-1&killstreak_tier=0&class=engineer&paint=6901050&particle=31>
* <https://backpack.tf/premium/search?item=Barnstormer&quality=5&australium=-1&killstreak_tier=0&particle=31>
* <https://backpack.tf/premium/search?item=Barnstormer&quality=5&australium=-1&killstreak_tier=0&class=engineer&paint=6901050&particle=31&numeric=level&value=0> (Because the Unusual bot is bugged, every unusual is display with level 0, if you want to get the correct level in an accurate search you have to add an extension which replaces the level 0 with the correct level)
* <https://marketplace.tf/items/988;5;u31>
