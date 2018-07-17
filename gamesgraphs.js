queue()
    .defer(d3.csv, "data/ign.csv")
    .await(makeGraph);
    
let obj = {};

function makeGraph(error, ignData) {
    let ndx = crossfilter(ignData);
    let titleDim = ndx.dimension(dc.pluck("platform"));
    let totalCountBytitle = titleDim.group();
    let barColors = d3.scale.ordinal().range(["red", "blue", "green", "yellow"]);
    let titleChart = dc.barChart("#titleChart");
    titleChart
        .width(1000)
        .height(600)
        .margins({ bottom: 100, top: 20, left: 30, right: 10 })
        .dimension(titleDim)
        .group(totalCountBytitle)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .yAxisLabel("No of Releases")
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(barColors)
        .yAxis().ticks(4)


    let genreDim = ndx.dimension(dc.pluck("genre"));
    let gameNameDim = ndx.dimension(dc.pluck("title"));
    
    obj.gameName = gameNameDim;
   //console.log(obj)

    let totalCountByGenre = genreDim.group();
    let genreChart = dc.barChart("#genreChart");
    genreChart
        .width(1200)
        .height(600)
        .margins({ bottom: 100, top: 20, left: 30, right: 10 })
        .dimension(genreDim)
        .group(totalCountByGenre)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .yAxisLabel("No of Releases")
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(barColors)
        .yAxis().ticks(4)


let titles = ndx.dimension(dc.pluck("title"));
    let titlesReduced = titles.group().reduce(
        function(p, v) {
            ++p.count;
            p.total += +v.score;
            p.average = p.total / p.count;
            return p;
        },
        function(p, v) {
            --p.count;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            }
            else {
                p.total -= +v.score;
                p.average = p.total / p.count;
            };
            return p;
        },
        function() {
            return { count: 0, total: 0, average: 0 };
        }
    );
    
    let titlesAll = titlesReduced.all();

    function titleSelectMenu () {
        let value;
        
           
    for (var key in titlesAll) {
      
       let titles = titlesAll[key]["key"]
           
    }
        
    }
    
    titleSelectMenu();
 
    



    let genreAvDim = ndx.dimension(dc.pluck("genre"));
    let averageScore = genreDim.group().reduce(
        function(p, v) {
            ++p.count;
            p.total += +v.score;
            p.average = p.total / p.count;
            return p;
        },
        function(p, v) {
            --p.count;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            }
            else {
                p.total -= +v.score;
                p.average = p.total / p.count;
            };
            return p;
        },
        function() {
            return { count: 0, total: 0, average: 0 };
        }
    );
    //console.log(averageScore.all())
    let averageScoreChart = dc.rowChart("#averageScore-chart");
    averageScoreChart
        .width(600)
        .height(500)
        .dimension(genreAvDim)
        .group(averageScore)
        .valueAccessor(function(p) {
            return p.value.average;
        })
        .cap(10)
        .othersGrouper(false)
        .xAxis().ticks(4)

    let editorschoiceDim = ndx.dimension(dc.pluck("editors_choice"));
    let totalcounteditorschoice = editorschoiceDim.group();
        dc.pieChart("#editors_choice-Piechart")
        .height(400)
        .radius(250)
        .dimension(editorschoiceDim)
        .group(totalcounteditorschoice);
        
    let scorephraseDim = ndx.dimension(dc.pluck("score_phrase"));
    let totalcountscorephrase = scorephraseDim.group();
        dc.pieChart("#score_phrase-Piechart")
        .height(400)
        .radius(250)
        .dimension(scorephraseDim)
        .group(totalcountscorephrase);
        

 let yearDim = ndx.dimension(dc.pluck("release_year"))
 let minYear = yearDim.bottom(1)[0].release_year
 let maxYear = yearDim.top(1)[0].release_year
 
 let yearScoreDim = ndx.dimension(function(d){
     return [d.release_year, d.score];
 })
 
 let yearScoreGroup = yearScoreDim.group();
 dc.scatterPlot("#scatteredChart")
    .width (800)
    .height (400)
    .x(d3.scale.linear().domain([minYear, maxYear]))
    .symbolSize(8)
    .clipPadding(10)
    .dimension(yearScoreDim)
    .group(yearScoreGroup)


// let dayDim = ndx.dimension(dc.pluck("release_day"))
//  let minDay = dayDim.bottom(1)[0].release_day
//  let maxDay = dayDim.top(1)[0].release_day
 
//  let dayScoreDim = ndx.dimension(function(d){
//      return [d.release_year, d.score];
//  })
 
//  let dayScoreGroup = dayScoreDim.group();
//  dc.scatterPlot("#releaseDayChart")
//     .width (800)
//     .height (700)
//     .x(d3.scale.linear().domain([minDay, maxDay]))
//     .symbolSize(8)
//     .clipPadding(10)
//     .dimension(dayScoreDim)
//     .group(dayScoreGroup)





    dc.renderAll();
}










