import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../../UserList.css";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import Avatar from "@material-ui/core/Avatar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import { CardHeader, Divider } from "@material-ui/core";

const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300
  }
});

const GET_COMPANY = gql`
  query company($id: ID) {
    Company(id: $id) {
      id
      name
      created_at {
        formatted
      }
      domain_name
      owner_assigned_date
      address {
        id
        street_address1
      }
      phone_numbers
      parent
      website_url
      contacts {
        id
        first_name
        last_name
      }
      properties {
        id
        name
      }
      listings {
        id
        name
      }
      fb_fans {
        id
        first_name
      }
      team {
        id
        name
      }
      fb_page
      child_companies_num
      li_page
      lifecycle_stage
      last_contacted
      twitter_bio
      #      web_technologies
      first_contact_create_date
      last_seen
      first_seen
      year_founded
      description
      annual_revenue
      industry
      is_public
      contacted_times
      employees_num
      first_contact_created_at
      last_activity
      last_modified
      li_bio
      owner {
        first_name
        last_name
      }
      owner_assigned_at
      pageviews_num
      phone
      sessions_num
      time_zone
      mailed(filter: { action: true }) {
        timestamp {
          formatted
        }
        Mail {
          id
          msgs
        }
      }
    }
  }
`;

function CompanyEdit(props) {
  const { classes } = props;
  const params = props.match.params;
  const [showContent, setShowContent] = React.useState(false);

  const { loading, data, error } = useQuery(GET_COMPANY, {
    variables: {
      id: params["uid"]
    }
  });

  return (
    <>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}

      {data && !loading && !error && (
        <Grid
          container
          spacing={3}
          style={{
            border: "3px solid blue",
            margin: "12px"
          }}
        >
          {/*About Card*/}
          <Grid item md={3}>
            <Grid
              item
              md={10}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              About
            </Grid>
            <Grid
              item
              md={10}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              {data.Company.map(
                ({
                  name,
                  id,
                  created_at,
                  domain_name,
                  website_url,
                  child_companies_num,
                  li_page,
                  lifecycle_stage,
                  last_contacted,
                  twitter_bio,
                  last_seen,
                  first_seen,
                  year_founded,
                  description,
                  annual_revenue,
                  industry,
                  contacted_times,
                  employees_num,
                  last_activity,
                  last_modified,
                  li_bio,
                  owner,
                  owner_assigned_at,
                  phone,
                  sessions_num,
                  time_zone
                }) => (
                  <Card key={"card" + id}>
                    <CardContent>
                      <Avatar>***</Avatar>
                      <Typography gutterBottom variant="h5" component="h2">
                        {name ? name : "no data"}
                      </Typography>
                    </CardContent>
                    <CardActionArea>
                      <CardActions>
                        <Link to="/" size="small" color="primary">
                          Note
                        </Link>
                        <Link to="/" size="small" color="primary">
                          Email
                        </Link>
                        <Link to="/" size="small" color="primary">
                          Call
                        </Link>
                        <Link to="/" size="small" color="primary">
                          Log
                        </Link>
                        <Link to="/" size="small" color="primary">
                          Task
                        </Link>
                        <Link to="/" size="small" color="primary">
                          Meet
                        </Link>
                      </CardActions>
                    </CardActionArea>
                    <Divider />

                    <CardContent>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        <span>Name:</span>
                        <span>{name}</span>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        <span>created at:</span>
                        <span>{created_at.formatted}</span>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        <span>domain name:</span>
                        <span>{domain_name}</span>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        <span>website url:</span>
                        <span>{website_url}</span>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>child companies num:</span>
                          <span>{child_companies_num}</span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>last contacted:</span>
                          <span>{last_contacted}</span>
                        </Typography>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>description:</span>
                          <span>{description}</span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>industry:</span>
                          <span>{industry}</span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>employees num:</span>
                          <span>{employees_num}</span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>li bio:</span>
                          <span>{li_bio}</span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>owner:</span>
                          <span>
                            {owner
                              ? `${owner.first_name} ${owner.last_name}`
                              : ""}
                          </span>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          <span>phone:</span>
                          <span>{phone}</span>
                        </Typography>
                      </Typography>
                    </CardContent>
                  </Card>
                )
              )}
            </Grid>
          </Grid>
          {/*Activity*/}
          <Grid item md={6}>
            <Grid
              item
              md={10}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              Activity
            </Grid>
            <Grid
              item
              md={10}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              {data.Company.map(({ mailed }) =>
                mailed.map(({ Mail, timestamp }) => (
                  <Card key={"card" + Mail.id}>
                    <CardHeader
                      title={"Mailed "}
                      subheader={timestamp.formatted}
                    />

                    <Divider />

                    <CardContent key={"cd" + Mail.id}>
                      <Typography key={"tpip" + Mail.id}>
                        {JSON.parse(Mail.msgs).map(({ from, date, text }) => (
                          <div>
                            <p>from:{from}</p>
                            <p>date:{date}</p>
                            <p>text:{text}</p>
                            <Divider />
                          </div>
                        ))}
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.actions}>
                      <Button size="small" color="primary" variant="text">
                        Reply
                        <EmojiPeopleIcon className={classes.EmojiPeople} />
                      </Button>
                    </CardActions>
                  </Card>
                ))
              )}
            </Grid>
          </Grid>
          {/*Associations*/}
          <Grid item md={3}>
            <Grid
              item
              md={10}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              Associations
            </Grid>
            <Grid
              item
              md={10}
              style={{
                border: "2px solid blue",
                margin: "2px"
              }}
            >
              {data.Company.map(({ contacts }) =>
                contacts.map(({ id, first_name, last_name }) => (
                  <Card key={"card-$id"}>
                    <CardHeader title="Contact" />
                    <Divider />
                    <CardContent key={"cd" + id}>
                      <Typography key={"tp" + id}>
                        <Link
                          key={"link" + id}
                          className="edit-link"
                          to={"/contacts/" + id}
                        >
                          {first_name} {last_name}
                        </Link>
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default withStyles(styles)(CompanyEdit);
