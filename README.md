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

* https://backpack.tf/item/6337300606
* https://backpack.tf/classifieds?item=Barnstormer&quality=5&australium=-1&killstreak_tier=0&particle=31
* https://backpack.tf/classifieds?item=Barnstormer&quality=5&australium=-1&killstreak_tier=0&class=engineer&paint=6901050&particle=31
* https://backpack.tf/premium/search?item=Barnstormer&quality=5&australium=-1&killstreak_tier=0&particle=31
* https://backpack.tf/premium/search?item=Barnstormer&quality=5&australium=-1&killstreak_tier=0&class=engineer&paint=6901050&particle=31&numeric=level&value=0 (Because the Unusual bot is bugged, every unusual is display with level 0, if you want to get the correct level in an accurate search you have to add an extension which replaces the level 0 with the correct level)
* https://marketplace.tf/items/988;5;u31
