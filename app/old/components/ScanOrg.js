import React from 'react'
import {Row, Col, Card, Button, InputGroup, FormControl} from 'react-bootstrap';
import Aux from "../hoc/_Aux";

const ScanOrg = ({onChangeForm, scanOrg }) => {


    return(
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                        <h5 className="mt-5">Scan Org</h5>
                        <div></div>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            onChange={(e) => onChangeForm(e)}
                                            placeholder="Organization Name"
                                            name="inputOrgScan"
                                            id="inputOrgScan"
                                        />
                                        <InputGroup.Append>
                                            <Button type="button" onClick= {(e) => scanOrg()}>Scan</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    )
}

export default ScanOrg