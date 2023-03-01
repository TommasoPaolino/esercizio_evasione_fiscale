const svgEl = document.getElementById('chart')
const width = svgEl.getAttribute('width')
const height = svgEl.getAttribute('height')
const padding = 100
const svg = d3.select('#chart')
const color1 = '#053F5C'//'#87CEFA'
const color2 =  '#F27F0C'//'#FF8400'
const textColor = '#194d30'
const ticks = 10

const vpadding = 70
const hpadding = 100

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
	var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	}
}

const describeArc = (x, y, radius, startAngle, endAngle) => {

	var start = polarToCartesian(x, y, radius, endAngle)
	var end = polarToCartesian(x, y, radius, startAngle)

	var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

	var d = [
	    "M", start.x, start.y, 
	    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ")

	return d + `L ${x} ${y} Z`       
}



const data = d3.csvParse(dataset, d => {
	return {
		companyType : d.companyType,
		nCompanies : +d.nCompanies,
		percControlled : +d.percControlled,
		evasion : +d.evasion
	}
})

const xScale=d3.scaleLinear()
	.domain([0,data.length])
	.range([hpadding,width-hpadding])


const yScale=d3.scaleLinear()
	.domain([0,d3.max(data, d => d.evasion)])
	.range([height-vpadding,vpadding])

	

const yAxis=d3.axisLeft().tickFormat(d => `${d3.format(".2s")(d).replace(/G/, " Mld").replace(/0.0/, "0 Mld")}`).scale(yScale)
	.ticks(ticks)
	.tickSize(-(width-(hpadding*2)))

	


const yTicks = svg
	.append('g')
	.attr('transform', `translate(${hpadding}, 0)`)
	.call(yAxis)



//<line x1="0" y1="80" x2="100" y2="20" stroke="black" />
data.forEach(function(d, i) { 
	svg.append("g")
	.attr('transform',`translate(${hpadding}, ${yScale(d.evasion)})`)
	.attr("stroke", "blue")
	.append("path")
	.attr("stroke-dasharray", "5,5")
	.attr("stoke-linecap", "butt")
	.attr("d", `M5 0 ${"l" + xScale(i)} 0`)
	/*.append("line")
	.attr("x1", ""+hpadding+"")
	.attr("x2", ""+(xScale(i)+ hpadding)+"")
	.attr("y1", ""+yScale(d.evasion)+"") 
	.attr("y2", ""+yScale(d.evasion)+"")
	.attr("stroke-linecap", "butt")
	.attr("stroke", "#0704b5")
	.attr('color', textColor)*/


	svg
	.append("g")
	.attr('transform',`translate(${hpadding- 3.69*10}, ${yScale(d.evasion)})`)
	.append("text")
	.attr("font-weight" , "bold")
	.attr("font-size", "10px")
	.style("font-family", "sans-serif")
	.style("color", "rgb(25, 77, 48)")
	.text(d.evasion/1000000000 + " Mld")
	




	})


/*data.forEach(function(d, i) { 

	svg.append("g")
	.attr('transform',`translate(${hpadding}, ${yScale(d.evasion)})`)
	.attr("stroke", "blue")
	.append("path")
	.attr("stroke-dasharray", "5,5")
	.attr("stoke-linecap", "butt")
	.attr("d", `M5 0 ${"l" + xScale(i)} 0`)
		svg
		.append("line")
		
		.attr("x1", ""+(xScale(i)+ hpadding)+"")
		.attr("x2", ""+(xScale(i)+ hpadding)+"")
		.attr("y1", "" + (yScale(d.evasion)) +"") 
		.attr("y2", "" +(height -vpadding) +"")
		 
		.attr("stroke", "#D3D3D3")
		.attr('color', textColor)
	
	
	
		})*/
const Radius = (width /  (data.length + 20))  

svg
	.selectAll('.tick line')
	.style('stroke', '#D3D3D3')


svg
	.selectAll('.tick text')
	.style('color', textColor)


svg
	.selectAll('path.domain')
	.style('stroke-width', 0)
	
const aziende = svg
	.selectAll('g.stringa')
	.data(data)
	.enter()
	.append('g')
		.attr('class', 'stringa')
		.attr('transform',(d,i) => `translate(${xScale(i)}, ${yScale(d.evasion)})`)
	

const cerchi = aziende
 	.append('circle')
	.attr("border-radius" ,"10px")
	 	.attr('fill',color1)
 		.attr('r',Radius)
		.attr('cx', hpadding)
		.attr('cy', 0)
		.attr("stroke", "black")
		.attr("stroke-width", 2)


const archi = aziende
 	.append('path')
	 	.attr('fill', color2)
		.attr('d', d => describeArc((hpadding), 0, Radius-1, 0, (d.percControlled * 360)))
		

const testo = svg
        .selectAll('g.testo')
		.data(data)
		.enter()
		.append('g')
			.attr('class', 'testo')
			.attr('transform',(d,i) => `translate(${hpadding+ xScale(i)}, ${yScale(d.evasion) + Radius +20})`)
			.attr("font-weight" , "bold")
			
testo.append("text").text(function(d){ return d.companyType}).style("text-anchor", "middle")


const testo_perc = svg
        .selectAll('g.perc')
		.data(data)
		.enter()
		.append('g')
			.attr('class', 'perc')
			.attr('transform',(d,i) => `translate(${padding+ xScale(i)+ 7}, ${yScale(d.evasion) -  Radius -10   })`);
			
testo_perc.append("text").text(function(d) {return bigDecimal.round(""+d.percControlled * 100 +"" , 2) + '%'}).style("text-anchor", "middle")

svg.append("g")
	.attr("transform", "translate(" + `${(width-8 - hpadding*2)}` + "," + 25 + ")")
	.append("text")
	.attr("font-size", "15px").text("Legenda:")

svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width - hpadding-40) + "," + ((hpadding/4) +8 ) + ")")
	.attr("width", "10")
	.attr("height", "10")
	.attr("fill", `${color2}`)

svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width - hpadding-40) + "," + ((hpadding/4) + 20) + ")")

	.attr("width", "10")
	.attr("height", "10")
	.attr("fill", `${color1}`)

svg.append("g")
	.attr("transform", "translate(" + (width - hpadding-20) + "," + ((hpadding/4)+16) + ")")
	.append("text")
	.attr("font-size", "12px").text("Controllato")

svg.append("g")
	.attr("transform", "translate(" + (width - hpadding-20)  + "," + ((hpadding/4)+29) + ")")
	.append("text")
	.attr("font-size", "12px").text("Non Controllato")

svg.append("g")
	.attr("transform", "translate(" + (width- hpadding -40)  + "," + (height- vpadding/2) + ")")
	.append("text")
	.attr("font-size", "14px").text("Dimensione azienda")


svg.append("g")
	.attr("transform", "translate(" + (50) + "," + ((width/2)-10) + ")")
	.append("text")
	.attr("font-size", "14px").text("Capitale evaso in miliardi(€)").attr("transform", "rotate(-90)")



console.log(data)



