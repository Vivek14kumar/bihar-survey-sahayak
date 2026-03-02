import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register the Hindi Font (Ensure path: /public/fonts/NotoSansDevanagari-Regular.ttf)
Font.register({
  family: "Hindi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Hindi",
    fontSize: 10,
    backgroundColor: '#fff',
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: 15,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  headerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    borderBottom: 1,
    paddingBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: '#000',
    minHeight: 25,
  },
  tableColHeader: {
    borderRightWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  tableCell: {
    borderRightWidth: 1,
    borderColor: '#000',
    padding: 4,
  },
  chauhaddiText: {
    fontSize: 8,
    marginBottom: 2,
  }
});

export const PrapatraPDF = ({ data, todayDate }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Header  */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>प्रपत्र-2</Text>
        <Text>रैयत द्वारा स्वामित्व/धारित भूमि की स्व-घोषणा हेतु प्रपत्र</Text>
      </View>

      {/* Info Row [cite: 1] */}
      <View style={styles.headerGrid}>
        <Text>राजस्व ग्राम: {data.revenueVillage}  | </Text>
        <Text>थाना नं०: {data.thanaNo}  | </Text>
        <Text>हल्का नं०: {data.halkaNo}  | </Text>
        <Text>अंचल: {data.anchal}  | </Text>
        <Text>जिला: {data.district}</Text>
      </View>

      {/* Data Table  */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, { width: '20%' }]}><Text>रैयत का नाम</Text></View>
          <View style={[styles.tableColHeader, { width: '8%' }]}><Text>खाता</Text></View>
          <View style={[styles.tableColHeader, { width: '8%' }]}><Text>खेसरा</Text></View>
          <View style={[styles.tableColHeader, { width: '34%' }]}><Text>चौहद्दी (N, S, E, W)</Text></View>
          <View style={[styles.tableColHeader, { width: '30%' }]}><Text>दावा का आधार</Text></View>
        </View>

        {data.plots.map((plot, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={[styles.tableCell, { width: '20%' }]}>
              {index === 0 && data.ryotDetails.map((r, idx) => (
                <Text key={idx}>{idx + 1}. {r.name}</Text>
              ))}
            </View>
            <View style={[styles.tableCell, { width: '8%' }]}><Text>{plot.khata}</Text></View>
            <View style={[styles.tableCell, { width: '8%' }]}><Text>{plot.khesra}</Text></View>
            <View style={[styles.tableCell, { width: '34%' }]}>
              <Text style={styles.chauhaddiText}>N: {plot.north} | S: {plot.south}</Text>
              <Text style={styles.chauhaddiText}>E: {plot.east} | W: {plot.west}</Text>
            </View>
            <View style={[styles.tableCell, { width: '30%', borderRightWidth: 0 }]}>
              <Text>{index === 0 ? data.claimBasis : ""}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);