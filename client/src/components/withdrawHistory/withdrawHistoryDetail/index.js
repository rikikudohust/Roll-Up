import {
  Box,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import React from "react";
import Moment from 'react-moment';
const useStyles = makeStyles({
  root: {
    maxWidth: "100%",
  },
  media: {
    height: 0,
    paddingTop: "50%",
  },
  cardActions: {
    display: "flex",
    float: "right",
  },
  link: {
    padding: "8px",
    display: "flex",
    textDecoration: "none",
  },
  cardContent: {
  },
});
export function formatAddress(address) {
  return address?.slice(0, 6) + "..." + address?.slice(-4);
}
export const WithdrawHistoryDetail = ({ data }) => {
  const classes = useStyles();
  // console.log(data)
  const address = data.nftOwner
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Token Id: {data.tokenId}
      </Typography>
      <Typography variant="h5" gutterBottom>
        NFT owner: {formatAddress(address)}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Start time: &nbsp;
        <Moment format="hh:mm">
          {data.startTime}
        </Moment>
      </Typography>
      <Typography variant="h5" gutterBottom>
        Amount: {data.amount}
      </Typography>
    </Box>
    // <Card className={classes.root}>
    //   <CardContent  className={classes.cardContent}>
    //       <Typography variant="h5" gutterBottom>
    //         Token Id: {data.tokenId}
    //       </Typography>
    //       <Typography variant="h5" gutterBottom>
    //         NFT owner: {formatAddress(address)}
    //       </Typography>
    //       <Typography variant="h5" gutterBottom>
    //         Start time: &nbsp;
    //         <Moment format="hh:mm">
    //           {data.startTime}
    //         </Moment>
    //       </Typography>
    //       <Typography variant="h5" gutterBottom>
    //         Amount: {data.amount}
    //       </Typography>
    //   </CardContent>
    // </Card>
  );
};
