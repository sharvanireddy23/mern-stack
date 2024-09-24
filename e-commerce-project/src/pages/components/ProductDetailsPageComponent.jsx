import { Row, Col, Container, Image, ListGroup, Form, Button, Alert } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import ImageZoom from "js-image-zoom";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AddedToCartMessageComponent from "../../components/user/AddedToCartMessageComponent";
import MetaComponent from "../../components/MetaComponent";

const ProductDetailsPageComponent = ({ addToCartReduxAction, reduxDispatch, getProductDetails, userInfo, writeReviewApiRequest }) => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [showCartMessage, setShowCartMessage] = useState(false);
    const [product, setProduct] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [productReviewed, setProductReviewed] = useState(false)

    const messagesEndRef = useRef(null)

    const addToCartHandler = () => {
        reduxDispatch(addToCartReduxAction(id, quantity));
        setShowCartMessage(true)
    };

    useEffect(() => {
        if (productReviewed) {
            setTimeout(() => {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
            }, 200)
        }
    }, [productReviewed])


    useEffect(() => {
        if (product.images) {
            var options = {
                scale: 2,
                offset: { vertical: 0, horizontal: 0 },
            };
            product.images.map((image, id) => new ImageZoom(document.getElementById(`imageId${id + 1}`), options))
        }

        // new ImageZoom(document.getElementById("first"), options);
        // new ImageZoom(document.getElementById("second"), options);
        // new ImageZoom(document.getElementById("third"), options);
        // new ImageZoom(document.getElementById("fourth"), options);
    }, []);

    useEffect(() => {
        getProductDetails(id)
            .then((data) => {
                setProduct(data);
                setIsLoading(false);
            })
            .catch((error) => { setError(error.response.data.message ? error.response.data.message : error.response.data) })
    }, [id, productReviewed])
    console.log("product get-obe", product)

    const sendReviewHandler = (e) => {
        e.preventDefault();
        const form = e.currentTarget.elements;
        const formInputs = {
            comment: form.comment.value,
            rating: form.comment.value
        }
        if (e.currentTarget.checkValidity() === true) {
            // console.log(product._id, formInputs)
            writeReviewApiRequest(product._id, formInputs)
                .then((data) => {
                    if (data === "review created") {
                        setProductReviewed("You successfully reviewed the page")
                    }
                })
                .catch((error) => {
                    setProductReviewed(error.response.data.message ? error.response.data.message : error.response.data)
                })
        }
    }

    return (
        <>
            <MetaComponent title={product.name} description={product.description} />
            <Container>
                <AddedToCartMessageComponent showCartMessage={showCartMessage} setShowCartMessage={setShowCartMessage} />
                <Row className="mt-5">
                    {loading ? (
                        <h2>Loading product details...</h2>
                    ) : error ? (
                        <h2>{error}</h2>
                    ) : (
                        <>
                            <Col style={{ zIndex: 1 }} md={4}>
                                {product.images ? product.images.map((image, id) => (
                                    <div key={id}>
                                        <div id={`imageId${id + 1}`} key={id}>
                                            <Image crossOrigin="anonymous" fluid src={image.path ?? null} />
                                        </div>
                                        <br />
                                    </div>
                                )) : null}
                            </Col>
                            <Col md={8}>
                                <Row>
                                    <Col md={8}>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <h1>{product.name}</h1>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Rating readonly size={20} initialValue={product.rating} /> ({product.reviewsNumber})
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Price <span className="fw-bold">$ {product.price}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                {product.description}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col md={4}>
                                        <ListGroup>
                                            <ListGroup.Item>Status: {product.count > 0 ? "in stock" : "out of stock"}</ListGroup.Item>
                                            <ListGroup.Item>
                                                Price: <span className="fw-bold">$ {product.price}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Quantity:
                                                <Form.Select
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    size="lg"
                                                    className="quantity-dropdown"  // Applied z-index fix
                                                    aria-label="Default select example"
                                                >
                                                    {[...Array(product.count).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Button onClick={addToCartHandler} variant="danger">
                                                    Add to cart
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="mt-5">
                                        <h5>REVIEWS</h5>
                                        <ListGroup variant="flush">
                                            {product.reviews && product.reviews.map((review, index) => (
                                                <ListGroup.Item key={index}>
                                                    {review.user.name} <br />
                                                    <Rating readonly size={20} initialValue={review.rating} />
                                                    <br />
                                                    {review.createdAt.substring(0, 10)} <br />
                                                    {review.comment}
                                                </ListGroup.Item>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </ListGroup>
                                    </Col>
                                </Row>
                                <hr />
                                {!userInfo.name && <Alert variant="danger">Login first to write a review</Alert>}

                                <Form onSubmit={sendReviewHandler}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Write a review</Form.Label>
                                        <Form.Control name="comment" required as="textarea" disabled={!userInfo.name} rows={3} />
                                    </Form.Group>
                                    <Form.Select name="rating" required disabled={!userInfo.name} aria-label="Default select example">
                                        <option value="">Your rating</option>
                                        <option value="5">5 (very good)</option>
                                        <option value="4">4 (good)</option>
                                        <option value="3">3 (average)</option>
                                        <option value="2">2 (bad)</option>
                                        <option value="1">1 (awful)</option>
                                    </Form.Select>
                                    <Button type="submit" disabled={!userInfo.name} className="mb-3 mt-3" variant="primary">
                                        Submit
                                    </Button>
                                    {productReviewed}
                                </Form>
                            </Col>
                        </>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default ProductDetailsPageComponent;
