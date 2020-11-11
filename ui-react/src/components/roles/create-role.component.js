import React from "react";
import MultiStep from "react-multistep";
import RoleData from "./steps/step-role-data";
import StepSubmit from "./steps/step-submit";

import Grid from "@material-ui/core/Grid";
import ResponsiveCard from "../../responsive/ResponsiveCard.js";
import ResponsiveContainerGrid from "../../responsive/ResponsiveContainerGrid.js";

import "../css/styles.css";

const steps = [
  { name: "Roles Data", component: <RoleData /> },
  { name: "Submit", component: <StepSubmit /> },
];

function ContactCreate() {
  return (
    <div className="App">
      <ResponsiveContainerGrid>
        <Grid item xs={12} sm={12}>
          <ResponsiveCard>
            <h1>Create Role step</h1>
            <MultiStep steps={steps} />
          </ResponsiveCard>
        </Grid>
      </ResponsiveContainerGrid>
    </div>
  );
}

export default ContactCreate;
