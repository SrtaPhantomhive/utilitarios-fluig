$(document).ready(function () {
   $("#gerarBtn").on("click", function () {
      var codigo = $("#nomeDataset").val().trim();

      generatePdfFile(codigo);
   })
})

var linhas = [];

function generatePdfFile(dataset) {
   var c1 = DatasetFactory.createConstraint("groupId", dataset, dataset, ConstraintType.MUST)
   var ds = DatasetFactory.getDataset("colleagueGroup", null, [c1], null)
   console.log(ds.values.length)
   for (var i = 0; i < ds.values.length; i++) {
      var mat = ds.values[i]["colleagueGroupPK.colleagueId"];
      var c2 = DatasetFactory.createConstraint("colleagueId", mat, mat, ConstraintType.MUST);
      var ds2 = DatasetFactory.getDataset("colleague", null, [c2], null)
      if (ds2.values[0]) {
         linhas.push({
            "Mat": ds2.values[0]["colleaguePK.colleagueId"],
            "Nome": ds2.values[0]["colleagueName"],
            "Email": ds2.values[0]["mail"],
         });
      }
   }

   var colunas = ['Mat', 'Nome', 'Email'];
   var largura = ['*', '*', '*', '*'];

   var docDefinition = {
      pageMargins: [40, 97, 40, 40],
      content: [
         table(linhas, colunas, largura)
      ],
      styles: {
         table: {
            fillColor: "#F8F8F8",
            margin: [0, 20, 0, 0]
         },
         styleTextObs: {
            fontSize: 10,
            bold: true,
            alignment: "left",
         },
         footer: {
            margin: [20, 0, 0, 0]
         },
         header: {
            fontSize: 22,
            bold: true,
            alignment: "center",
            margin: [25, 10, 25, 5]
         },
         titleText: {
            italics: true,
            alignment: 'left',
            bold: true,
            margin: [0, 10, 0, 0]
         },
         anotherStyle: {
            italics: true,
            alignment: 'left',
            bold: false,
            margin: [0, 10, 0, 0]
         },
         pageHeader: {
            fontSize: 9,
            alignment: 'left'
         },
         title: {
            bold: true,
            fontSize: 18,
            alignment: "center"
         },
         tableBody: {
            fontSize: 10,
            bold: false,
            italics: true
         }
      }
   }

   const pdfDocGenerator = pdfMake.createPdf(docDefinition);
   var datasetFormatado = dataset.toString().replace(".", " ");
   pdfMake.createPdf(docDefinition).download("Grupo " + datasetFormatado + " - " + new Date().toLocaleDateString());

   function buildTableBody(data, columns) {
      var body = [];
      body.push(columns);
      data.forEach(function (row) {
         var dataRow = [];
         columns.forEach(function (column) {
            dataRow.push(row[column].toString());
         })
         body.push(dataRow);
      });
      return body;
   }

   function table(data, columns, widths) {
      return {
         layout: 'lightHorizontalLines', // optional
         table: {
            widths: widths,
            headerRows: 1,
            body: buildTableBody(data, columns)
         },
         style: 'table'
      };
   }
}