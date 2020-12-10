import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";

const required = (val) => val && val.length;
const chooseRating = (val) => val !== "select...";
const minLength = (val) => val && val.length >= 2;
const maxLength = (val) => val && val.length <= 15;

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      rating: "select...",
      username: "",
      comment: "",
      touched: {
        rating: false,
        username: false,
        comment: false,
      },
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.addComment(
      this.props.campsiteId,
      values.rating,
      values.author,
      values.text
    );
  }

  render() {
    return (
      <>
        <Button onClick={this.toggleModal} color="warning" className="fa-lg">
          <i className="fa fa-pencil" /> Submit a Comment
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal} closeButton>
            <h2>Submit a Comment</h2>
          </ModalHeader>

          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <Row className="form-group">
                <Label htmlFor="rating" md={2}>
                  Rating
                </Label>
                <Col md={10}>
                  <Control.select
                    model=".rating"
                    name="rating"
                    className="form-control"
                    validators={{
                      required,
                      chooseRating,
                    }}
                  >
                    <option>select...</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                  <Errors
                    className="text-danger"
                    model=".rating"
                    show="touched"
                    component="div"
                    messages={{
                      required: "Required.",
                      chooseRating: "Please select a rating.",
                    }}
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="username" md={2}>
                  Your Name
                </Label>
                <Col md={10}>
                  <Control.text
                    model=".username"
                    id="username"
                    placeholder="your name"
                    className="form-control"
                    validators={{
                      required,
                      minLength,
                      maxLength,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".username"
                    show="touched"
                    component="div"
                    messages={{
                      required: "Required.",
                      minLength: "Name must be between 2 and 15 characters.",
                      maxLength: "Name must be between 2 and 15 characters.",
                    }}
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="comment" md={2}>
                  Comment
                </Label>
                <Col md={10}>
                  <Control.textarea
                    model=".comment"
                    id="comment"
                    rows="10"
                    className="form-control"
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Col>
                  <Button type="submit" value="submit" color="primary">
                    Submit
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

function RenderCampsite({ campsite }) {
  return (
    <div className="col-md-5 m-1">
      <Card>
        <CardImg top src={campsite.image} alt={campsite.name} />
        <CardBody>
          <CardText>{campsite.description}</CardText>
        </CardBody>
      </Card>
    </div>
  );
}

function RenderComments({ comments, addComment, campsiteId }) {
  if (comments) {
    return (
      <div className="col-md-5 m-1">
        <h4>Comments:</h4>
        {comments.map((comment) => (
          <ul key={comment.id}>
            <li>
              {comment.text}
              <br />
              {comment.author} on{" "}
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              }).format(new Date(Date.parse(comment.date)))}
            </li>
          </ul>
        ))}
        <CommentForm campsiteId={campsiteId} addComment={addComment} />
      </div>
    );
  }
}

function CampsiteInfo(props) {
  if (props.campsite) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/directory">Directory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
            </Breadcrumb>
            <h2>{props.campsite.name}</h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderCampsite campsite={props.campsite} />
          <RenderComments
            comments={props.comments}
            addComment={props.addComment}
            campsiteId={props.campsite.id}
          />
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default CampsiteInfo;
