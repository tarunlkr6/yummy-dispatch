import { StyleSheet } from "@react-pdf/renderer";

export const invoiceStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    alignSelf: "center",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333333",
  },
  restaurantDetails: {
    fontSize: 10,
    textAlign: "center",
    color: "#555555",
    marginBottom: 15,
  },
  section: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: "1px solid #dddddd",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 12,
    color: "#444444",
  },
  itemPrice: {
    fontSize: 12,
    color: "#444444",
    textAlign: "right",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "right",
  },
  footer: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 15,
    color: "#777777",
  },
});
