queue()
    .defer(d3.csv, "data/ign.csv")
    .await(makeGraph);

function makeGraph(error, ignData) {
    let ndx = crossfilter(ignData);
    let titleDim = ndx.dimension(dc.pluck("platform"));
    let totalCountBytitle = titleDim.group();
    let barColors = d3.scale.ordinal().range(["red", "blue", "green", "yellow"]);
    let titleChart = dc.barChart("#titleChart");
    titleChart
        .width(1100)
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
    let totalCountByGenre = genreDim.group();
    let genreChart = dc.barChart("#genreChart");
    genreChart
        .width(1100)
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
    console.log(averageScore.all())
    let averageScoreChart = dc.rowChart("#averageScore-chart");
    averageScoreChart
        .width(500)
        .height(300)
        .dimension(genreAvDim)
        .group(averageScore)
        .valueAccessor(function(p) {
                    return p.value.average;
                })
        .cap(10)
        .othersGrouper(false)
        .xAxis().ticks(4)

    dc.renderAll();
}













/*---------------------    
     
     let parseDate = d3.time.format("%d/%m/%Y").parse;

    transactionsData.forEach(function(d) {
        d.date = parseDate(d.date);
    });

    let dateDim = ndx.dimension(dc.pluck("date"));

    let minDate = dateDim.bottom(1)[0].date;
    let maxDate = dateDim.top(1)[0].date;
    
    let nameDim = ndx.dimension(dc.pluck("name"));
    let spendGroup = nameDim.group().reduceSum(dc.pluck("spend"));
    
    let spendChart = dc.barChart("#spend-chart");
    let barColors = d3.scale.ordinal().range(["red","blue","green","yellow"]);
    spendChart
    .width(500)
    .height(300)
    .dimension(nameDim)
    .group(spendGroup)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Person");
    
     
     
        dc.renderAll()

}
        
        

    

//     let sexDim = ndx.dimension(dc.pluck("sex"));
//     let totalPeople = sexDim.group();
//     let sexChart = dc.pieChart("#sex-chart");

//     sexChart
//         .height(300)
//         .radius(100)
//         .dimension(sexDim)
//         .group(totalPeople);

//     let yrsServiceDim = ndx.dimension(function(d){
//         return +d["yrs_service"];
//     });
//     let totalSalary = yrsServiceDim.group().reduce(
//                 function(p, v) {
//                     ++p.count;
//                     p.total += +v["salary"];
//                     p.average = p.total / p.count;
//                     return p;
//                 },
//                 function(p, v) {
//                     --p.count;
//                     if (p.count == 0) {
//                         p.total = 0;
//                         p.average = 0;
//                     }
//                     else {
//                         p.total -= v["salary"];
//                         p.average = p.total / p.count;
//                     }
//                     return p;
//                 },
//                 function() {
//                     return { count: 0, total: 0, average: 0 };
//                 }
//             );
    
//     let salaryChart = dc.barChart("#service-salary-chart");
    
//     salaryChart
//         .width(1000)
//         .height(450)
//         .dimension(yrsServiceDim)
//         .group(totalSalary)
//         .x(d3.scale.ordinal())
//         .xUnits(dc.units.ordinal)
//         .xAxisLabel("Year Service")
//         .valueAccessor(function(p) {
//                     return p.value.average;
//                 })
//         .colorAccessor(function(d) {
// 			return d.key;
//         })
// 		.colors(barColors)
//         .yAxis().ticks(4);

// /*--------------*/

// let yearsServiceDim = ndx.dimension(dc.pluck("yrs_service"));


//     let profSalary = yearsServiceDim.group().reduceSum(function(d) {
//         if (d.rank === "Prof") {
//             return +d.salary;
//         }
//         else {
//             return 0;
//         }
//     })

//      let assisProfSalary = yearsServiceDim.group().reduceSum(function(d) {
//         if (d.rank === "AsstProf") {
//             return +d.salary;
//         }
//         else {
//             return 0;
//         }
//     })

//      let assocProfSalary = yearsServiceDim.group().reduceSum(function(d) {
//         if (d.rank === "AssocProf") {
//             return +d.salary;
//         }
//         else {
//             return 0;
//         }
//     })

//     let compositeChart = dc.compositeChart("#composite-chart")

//     compositeChart
//         .width(1000)
//         .height(200)
//         .dimension(yearsServiceDim)
//         .group(profSalary)
//         .xUnits(dc.units.ordinal
//         )
//         .x(d3.scale.ordinal())
//         .yAxisLabel("Spend")
//         .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
//         .renderHorizontalGridLines(true)
//         .compose([
//             dc.lineChart(compositeChart)
//             .colors("green")
//             .group(profSalary, "Prof"),
//             dc.lineChart(compositeChart)
//             .colors("red")
//             .group(assisProfSalary, "AssisProf"),
//             dc.lineChart(compositeChart)
//             .colors("blue")
//             .group(assocProfSalary, "AssocProf")

//  ])
