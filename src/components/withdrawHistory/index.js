import { Box, Container, Grid, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { WithdrawHistoryDetail } from "./withdrawHistoryDetail";

export default function WithdrawHistory(props) {
  const withdrawHistory = useSelector((state) => state.withdrawHistory);

  const { data } = withdrawHistory;
  if (!data) {
    return <Typography variant={"h6"}>Loadding</Typography>;
  }
  // console.log("🚀 ~ file: index.js ~ line 6 ~ WithdrawHistory ~ data", data)
  return (
    <Container>
      <Grid
        style={{ marginBottom: "10px", marginTop: "10px" }}
        container
        justify="center"
        spacing={4}
      >
        {data.map((index) => (
          <Grid item xs={12} sm={6} md={4}>
            <WithdrawHistoryDetail data={index} key={data.tokenId} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
