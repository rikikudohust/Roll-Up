import { Box, Button, makeStyles, Popper, Typography } from "@material-ui/core";
import { FiberManualRecord } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import disconnectCurrentWallet from "../web3/wallet/disconnect";


const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    minWidth: 200,
  },
  popper: {
    zIndex: theme.zIndex.modal,
  },
  imgCoin: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.common.white,
  },
  button: {
    color: "white",
    borderRadius: "8px",
    textTransform: "capitalize",
    minWidth: "163px",
    transition: "background 500ms linear",
    background: "linear-gradient(100.42deg, #2C85EE 16.07%, #4FB5FF 79.2%)",
    border: 0,
    padding: "3.5px 11.5px",
  },
  fiberIcon: {
    fontSize: 10,
    verticalAlign: "middle",
    marginRight: 2,
    color: "#01C514",
  },
  balanceValue: {
    fontWeight: 500,
  },
  btn: {
    padding: theme.spacing(0),
    textTransform: "unset",
    fontWeight: 400,
    "&:hover": {
      backgroundColor: "transparent",
      color: theme.palette.primary.main,
    },
  },
  btnBuyTrava: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));
export function formatAddress(address) {
  return address?.slice(0, 6) + "..." + address?.slice(-4);
  
}
export default function ConnectedWallet(){
  const dp = useDispatch();
  const { enqueueSnackbar: eq } = useSnackbar();
  const classes = useStyles();
  const address  = useSelector(state => state.address.address)
  function handleDisconnectWallet() {
    disconnectCurrentWallet(dp, eq);
  }
  return(
    <Fragment>
      <Button  size="small" className={classes.button} variant="outlined" onClick={handleDisconnectWallet}>
        <Box display="flex" alignItems="center">
          <Box pl={1.5}>
            <Typography align="left" style={{ fontSize: 10 }}>
              <FiberManualRecord className={classes.fiberIcon} /> Connected
            </Typography>
            <span style={{ fontSize: 15, lineHeight: 0 }}>{formatAddress(address)}</span>
          </Box>
        </Box>
      </Button>
    </Fragment>
  )
  
}