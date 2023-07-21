import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import Showdown from "showdown";
import { ResolutionEntityEnhanced } from "types";

import React from "react";
import Html from "react-pdf-html";

import { RESOLUTION_STATES, getDateFromUnixTimestamp } from "@lib/resolutions/common";
import { getPdfSigner } from "@lib/utils";

import ShareholdersPdf from "./ShareholdersPdf";
import VotingPdf from "./VotingPdf";

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

const initGetUserName = (usersData: any[]) => (ethereumAddress: string) =>
  usersData.find((user) => user.ethereumAddress === ethereumAddress)?.name;

export const Br = () => <>{"\n"}</>;
export const Bold = ({ children, inverse = false }: { children: any; inverse?: boolean }) => (
  <Text style={{ color: inverse ? "#FFF" : "#000", fontWeight: "heavy" }}>{children}</Text>
);
export const Small = ({ children }: { children: any }) => <Text style={{ fontSize: "10px" }}>{children}</Text>;

const ResolutionPdf = ({
  resolution,
  usersData,
  resolutionUrl,
}: {
  resolution: ResolutionEntityEnhanced;
  usersData: any[];
  resolutionUrl: string;
}) => {
  const getUserName = initGetUserName(usersData);
  const contentHtml = converter.makeHtml(resolution.content);
  return (
    <Document>
      <Page
        size="A4"
        style={{ ...styles.container, ...(resolution.state === RESOLUTION_STATES.REJECTED && { paddingTop: 60 }) }}
      >
        {resolution.state === RESOLUTION_STATES.REJECTED && (
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "white",
              backgroundColor: "red",
              padding: 10,
              borderRadius: 3,
            }}
          >
            <Text style={{ fontSize: "12px" }}>
              REJECTED on {resolution.rejectedAt} by {getUserName(resolution.rejectBy)}
            </Text>
          </View>
        )}
        <Text style={styles.headerTitle}>
          {resolution.state === RESOLUTION_STATES.ENDED ? (
            <Text>
              MINUTES AND RESOLUTION OF THE SHAREHOLDERS <Br />
              (without calling a meeting of shareholders)
            </Text>
          ) : (
            <>
              <View style={{ width: "100%" }}>
                <Text>DRAFT OF THE RESOLUTION OF THE SHAREHOLDERS</Text>
              </View>
              <Text>(without calling a meeting of shareholders)</Text>
            </>
          )}
        </Text>
        <View style={styles.headerInfo} wrap={false}>
          <View style={{ width: "60%" }}>
            {resolution.state === RESOLUTION_STATES.ENDED && (
              <>
                <Text>
                  <Bold>Time of determining the voting rights and active PoAs:</Bold>{" "}
                  {format(getDateFromUnixTimestamp(resolution.approveTimestamp), "dd LLL yyyy, H:mm")}
                </Text>
                <Text>
                  <Bold>Notification period for voting:</Bold> From{" "}
                  {format(getDateFromUnixTimestamp(resolution.approveTimestamp), "dd LLL yyyy, H:mm")} to{" "}
                  {resolution.resolutionTypeInfo.noticePeriodEndsAt}
                </Text>
                <Text>
                  <Bold>Voting period:</Bold> From {resolution.resolutionTypeInfo.noticePeriodEndsAt} to{" "}
                  {resolution.resolutionTypeInfo.votingEndsAt}
                </Text>
                <Text>
                  <Bold>Place of voting:</Bold> <Link src={resolutionUrl}>{resolutionUrl}</Link>
                </Text>
                <Text>
                  <Bold>Recording secretary:</Bold> {getPdfSigner(resolution)}
                </Text>
              </>
            )}
          </View>
          <View style={{ width: "40%", textAlign: "right" }}>
            <Text>
              <Bold>Business name:</Bold> {process.env.NEXT_PUBLIC_PROJECT_KEY} DAO OÜ
            </Text>
            <Text>
              <Bold>Registry code:</Bold>{" "}
              {process.env.NEXT_PUBLIC_PROJECT_KEY === "neokingdom" ? "16638166" : "16374990"}
            </Text>
            <Text>
              <Bold>Registered office:</Bold> Laki 11/1, 12915 Tallinn, Estonia
            </Text>
          </View>
        </View>
        <Text style={styles.title}>
          Topic of the resolution: #{resolution.id} {resolution.title}
        </Text>
        <Text style={{ ...styles.subTitle, marginBottom: "2px" }}>
          Created on {resolution.createdAt} by {getUserName(resolution.createBy)}{" "}
          <Text style={{ color: "#999", fontSize: "10px" }}>{resolution.createBy}</Text>
        </Text>
        <Text style={styles.subTitle}>
          Resolution type: {`${resolution.resolutionType.name} ${resolution.isNegative ? " (veto)" : ""}`}
        </Text>
        <Text style={styles.title}>Content of the resolution:</Text>
        <View style={styles.content}>
          <Html style={styles.content}>{contentHtml}</Html>
        </View>
        {resolution.state === RESOLUTION_STATES.PRE_DRAFT && (
          <>
            <View>
              <Text>Voting conditions:</Text>
              <Br />
              <Text>
                <Bold>{resolution.resolutionType.quorum}% of votes</Bold> are needed to approve the motion
              </Text>
            </View>
            {!/^0x0+$/.test(resolution.addressedContributor) && (
              <View style={{ ...styles.subTitle, marginTop: "8px" }}>
                <Text>The following contributor is excluded from voting:</Text>
                <Br />
                <Text>
                  {getUserName(resolution.addressedContributor)}{" "}
                  <Text style={{ color: "#999", fontSize: "10px" }}>{resolution.addressedContributor}</Text>
                </Text>
              </View>
            )}
          </>
        )}
        {resolution.state === RESOLUTION_STATES.ENDED && (
          <View>
            <View style={{ padding: "12px", backgroundColor: resolution.hasQuorum ? "green" : "red", color: "white" }}>
              {resolution.hasQuorum ? (
                <Text style={{ fontSize: "14px" }}>
                  The resolution of shareholders <Bold inverse>HAS BEEN ADOPTED</Bold> on{" "}
                  {resolution.resolutionTypeInfo.votingEndsAt}.
                </Text>
              ) : (
                <Text style={{ fontSize: "14px" }}>
                  The resolution of shareholders <Bold inverse>HAS NOT BEEN ADOPTED</Bold>. Voting ended on{" "}
                  {resolution.resolutionTypeInfo.votingEndsAt}.
                </Text>
              )}
              <Br />
              <Small>Shareholders did not submit dissenting opinions</Small>
            </View>
            <VotingPdf resolution={resolution} />
            <ShareholdersPdf resolution={resolution} getUserName={getUserName} />
          </View>
        )}
        <View fixed style={styles.signature}>
          <Text style={styles.note}>/signed digitally/</Text>
          <Text style={styles.note}>--------------------------------------</Text>
          <Text style={styles.note}>{getPdfSigner(resolution)}</Text>
          <Text style={styles.note}>Member of management board</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ResolutionPdf;
