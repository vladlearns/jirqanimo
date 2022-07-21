import * as d3 from "d3";
import {
  openedStories,
  closedStories,
  seoBugs,
  uiBugs,
  functionalBugs,
  translationBugs,
  notFixedBugs,
  leakedBugs,
} from "../stats.json";

d3.select(".story .opened").text(openedStories.total);
d3.select(".story .closed-story").text(closedStories.total);
d3.select(".bug .seo").text(seoBugs.total);
d3.select(".bug .ui").text(uiBugs.total);
d3.select(".bug .functional").text(functionalBugs.total);
d3.select(".bug .translation").text(translationBugs.total);
d3.select(".bug .not-fixed").text(notFixedBugs.total);
d3.select(".bug .leaked").text(leakedBugs.total);
