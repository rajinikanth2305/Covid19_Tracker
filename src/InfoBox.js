import React from "react";
import "./InfoBox.css";
import { Card, isRed, CardContent, Typography } from "@material-ui/core";
function InfoBox({ title, isRed, active, cases, total, ...props }) {
  return (
    <div
      className={`infoBox ${active && "infoBox--selected"} ${
        active && isRed && "infoBox--red"
      }`}
    >
      <Card onClick={props.onClick}>
        <CardContent>
          <Typography className="infoBox__title" color="textSecondary">
            {title}
          </Typography>
          <h2 className={`infoBox__cases ${!isRed && "infoBox--green"}`}>
            {cases}
          </h2>
          <Typography className="infoBox__total" color="textSecondary">
            {total} Total
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default InfoBox;
