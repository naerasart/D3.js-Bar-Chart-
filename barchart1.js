var url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
var req = new XMLHttpRequest()


req.open('GET', url, true)
req.onload = () => {

    var data = JSON.parse(req.responseText)

    var svg = d3.select('svg').attr('width', 600).attr('height', 300)




    var tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')


    var xAxis = d3.axisBottom(d3.scaleTime()
        .domain([d3.min(data.data.map((item) => {
            return new Date(item[0])
        })), d3.max(data.data.map((item) => {
            return new Date(item[0])
        }))])
        .range([80, 600 - 80]))

    var yAxis = d3.axisLeft(d3.scaleLinear()
        .domain([0, d3.max(data.data, (item) => {
            return item[1]
        })])
        .range([300 - 80, 80]))


    function bars() {

        svg.selectAll('rect')
            .data(data.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('width', (600 - (2 * 80)) / data.data.length)
            .attr('data-date', (item) => {
                return item[0]
            })
            .attr('data-gdp', (item) => {
                return item[1]
            })
            .attr('height', (item) => {
                return d3.scaleLinear()
                    .domain([0, d3.max(data.data, (item) => {
                        return item[1]
                    })])
                    .range([0, 300 - (2 * 80)])(item[1])
            })

        .attr('x', (item, index) => {
                return d3.scaleLinear()
                    .domain([0, data.data.length - 1])
                    .range([80, 600 - 80])
                    (index)
            })
            .attr('y', (item) => {
                return (300 - 80) - (d3.scaleLinear()
                    .domain([0, d3.max(data.data, (item) => {
                        return item[1]
                    })])
                    .range([0, 300 - (2 * 80)])(item[1]))
            })
            .on('mouseover', (item) => {
                tooltip.transition()
                    .style('visibility', 'visible')

                tooltip.text(item[0])

                document.querySelector('#tooltip').setAttribute('data-date', item[0])
            })
            .on('mouseout', (item) => {
                tooltip.transition()
                    .style('visibility', 'hidden')
            })
    }

    function axes() {



        svg.append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0, ' + (300 - 80) + ')')

        svg.append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + 80 + ', 0)')

    }




    bars()
    axes()
}
req.send()

// reference:https://www.notion.so/Visualize-Data-with-a-Bar-Chart-9e5ef4f33375409580a80f659cd8aa93