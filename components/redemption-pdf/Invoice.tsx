import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { addDays, format } from "date-fns";
import Showdown from "showdown";

import React from "react";

import { TOKEN_SYMBOL } from "@lib/utils";

const converter = new Showdown.Converter();
converter.setFlavor("github");

const invoiceTo = {
  neokingdom: {
    name: "Neokingdom DAO OÜ",
    address: "Sõle tn 14",
    address2: "10611, Tallinn, Estonia",
    registryCode: "16638166",
    vatNumber: "EE102569025",
  },
  crowdpunk: {
    name: "Crowdpunk OÜ",
    address: "Sõle tn 14",
    address2: "10611, Tallinn, Estonia",
    registryCode: "16813917",
    vatNumber: "EE102654736",
  },
  teledisko: {
    name: "Teledisko OÜ",
    address: "Sõle tn 14",
    address2: "10611, Tallinn, Estonia",
    registryCode: "16374990",
    vatNumber: "EE102438910",
  },
  vanilla: {
    name: "Vanilla OÜ",
    address: "Sõle tn 14",
    address2: "10611, Tallinn, Estonia",
    registryCode: "...",
    vatNumber: "...",
  },
}[process.env.NEXT_PUBLIC_PROJECT_KEY];

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
  walletInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  headerInfo: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: "12px",
    marginBottom: "16px",
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

const Invoice = ({
  companyInfo,
  total,
  vatNumber,
  invoiceNumber,
  walletAddress,
  usdt,
}: {
  companyInfo: string;
  total: string;
  vatNumber: string;
  usdt: string;
  invoiceNumber: string;
  walletAddress: string;
}) => {
  return (
    <Document>
      <Page size="A4" style={{ ...styles.container }}>
        <View style={styles.headerInfo} wrap={false}>
          <View style={{ width: "40%", textAlign: "left" }}>
            <Text>
              <Bold>Invoice number:</Bold> {invoiceNumber}
            </Text>
            <Text>
              <Bold>Date:</Bold> {format(new Date(), "dd.MM.yyyy")}
            </Text>
            <Text>
              <Bold>Due date:</Bold> {format(addDays(new Date(), 30), "dd.MM.yyyy")}
            </Text>
            <Text style={{ marginTop: "8px", marginBottom: "8px" }}>{companyInfo.replaceAll("/n", "<br />")}</Text>
            <Text>VAT No. {vatNumber}</Text>
          </View>
          <View style={{ width: "40%", textAlign: "right" }}>
            <Text>Invoice To</Text>
            <Text>
              <Bold>{invoiceTo.name}</Bold>
            </Text>
            <Text>{invoiceTo.address}</Text>
            <Text>{invoiceTo.address2}</Text>
            <Text style={{ marginTop: "8px" }}>Reg. No. {invoiceTo.registryCode}</Text>
            <Text>VAT No. {invoiceTo.vatNumber}</Text>
          </View>
        </View>
        <View style={{ marginTop: "24px" }}>
          <View style={{ display: "flex", fontSize: "14px", flexDirection: "row", backgroundColor: "#FAFAFA" }}>
            <Text style={{ width: "40%", padding: "8px" }}>Description</Text>
            <Text style={{ width: "20%", padding: "8px" }}>Quantity</Text>
            <Text style={{ width: "20%", padding: "8px" }}>Price per Token</Text>
            <Text style={{ width: "20%", padding: "8px" }}>Amount</Text>
          </View>
          <View style={{ display: "flex", fontSize: "12px", flexDirection: "row" }}>
            <Text style={{ width: "40%", padding: "8px" }}>Redemption of {TOKEN_SYMBOL} tokens</Text>
            <Text style={{ width: "20%", padding: "8px" }}>{total}</Text>
            <Text style={{ width: "20%", padding: "8px" }}>1€</Text>
            <Text style={{ width: "20%", padding: "8px" }}>{total}€</Text>
          </View>
          <View
            style={{
              display: "flex",
              fontSize: "12px",
              flexDirection: "row",
              marginTop: "48px",
              justifyContent: "flex-end",
            }}
          >
            <Text style={{ width: "20%", padding: "8px" }}>
              <Bold>Total</Bold>
            </Text>
            <Text style={{ width: "20%", padding: "8px" }}>
              <Bold>{total}€</Bold>
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              fontSize: "12px",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Text style={{ width: "20%", padding: "8px" }}>VAT</Text>
            <Text style={{ width: "20%", padding: "8px" }}>-</Text>
          </View>
          <View
            style={{
              display: "flex",
              fontSize: "12px",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Text style={{ width: "20%", padding: "8px" }}>
              <Bold>Invoice Total</Bold>
            </Text>
            <Text style={{ width: "20%", padding: "8px" }}>
              <Bold>{total}€</Bold>
            </Text>
          </View>
        </View>
        <View fixed style={styles.walletInfo}>
          <Text style={styles.note}>Amount paid sending {usdt} axlUSDC to</Text>
          <Text style={styles.note}>Ethereum wallet: {walletAddress}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
