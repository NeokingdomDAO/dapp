import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import Showdown from "showdown";
import { ResolutionEntityEnhanced } from "types";

import React from "react";
import Html from "react-pdf-html";

import { RESOLUTION_STATES, getDateFromUnixTimestamp } from "@lib/resolutions/common";
import { getPdfSigner } from "@lib/utils";

const converter = new Showdown.Converter();
converter.setFlavor("github");

// Create styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    color: "#676767",
  },
  headerTitle: {
    fontSize: "14px",
    marginBottom: "12px",
  },
  title: {
    fontSize: "16px",
    fontWeight: "ultrabold",
    marginBottom: "2px",
  },
  subTitle: {
    fontSize: "12px",
    marginBottom: "16px",
  },
  content: {
    fontSize: "12px",
    maxWidth: "90%",
  },
  note: {
    fontSize: "10px",
    color: "#999",
  },
  signature: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  headerInfo: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: "9px",
    marginBottom: "16px",
    borderBottom: "1px solid #999",
    borderTop: "1px solid #999",
    padding: "16px",
    paddingLeft: 0,
    paddingRight: 0,
  },
});

export const Br = () => <>{"\n"}</>;
export const Bold = ({ children, inverse = false }: { children: any; inverse?: boolean }) => (
  <Text style={{ color: inverse ? "#FFF" : "#000", fontWeight: "heavy" }}>{children}</Text>
);
export const Small = ({ children }: { children: any }) => <Text style={{ fontSize: "10px" }}>{children}</Text>;

const Invoice = ({ userInfo, total, invoiceNumber }: { userInfo: string; total: string; invoiceNumber: number }) => {
  const contentHtml = converter.makeHtml(userInfo);
  return (
    <Document>
      <Page size="A4" style={{ ...styles.container }}>
        <View style={styles.headerInfo} wrap={false}>
          <View style={{ width: "40%", textAlign: "right" }}>
            <Text>
              <Bold>Business name:</Bold> {process.env.NEXT_PUBLIC_PROJECT_KEY} DAO OÜ
            </Text>
            <Text>
              <Bold>Registry code:</Bold>{" "}
              {process.env.NEXT_PUBLIC_PROJECT_KEY === "neokingdom" ? "16638166" : "16374990"}
            </Text>
            <Text>
              <Bold>Registered office:</Bold> Sõle 14, Tallinn, 10611 , Estonia
            </Text>
          </View>
        </View>
        <View fixed style={styles.signature}>
          <Text style={styles.note}>/signed digitally/</Text>
          <Text style={styles.note}>--------------------------------------</Text>
          <Text style={styles.note}>Member of management board</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
