import * as React from "react";
import _ from "lodash";
import styled from "styled-components";
import { Button, Card, Checkbox, Form, Input, Row, Col, message } from "antd";
import StepList from "./components/StepsList/StepsList";
import { deepSearch } from "./utils/deepSearch";
import { JarMap, Step, Jar } from "./types";

const limit = 10;

export default function App() {
  const [jarMap, setJarMap] = React.useState<JarMap>({});
  const [targetJar, setTargetJar] = React.useState<number>();
  const [targetSize, setTargetSize] = React.useState<number>();
  const [stepList, setStepList] = React.useState<Step[]>([]);
  const [hasFailed, setHasFailed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const checkIntegrity = () => {
    for (const { name, maxSize } of Object.values(jarMap)) {
      if (!name || !maxSize) {
        return false;
      }
    }
    return true;
  };

  const onClickButton = () => {
    setLoading(true);
    if (checkIntegrity() && !isNaN(targetSize as number) && targetJar) {
      const jarList: Jar[] = _.cloneDeep(Object.values(jarMap));
      const steps = deepSearch(
        jarList,
        targetSize as number,
        _.cloneDeep(jarMap[targetJar as number]),
        [jarList.map(({ currentSize }) => currentSize)]
      );
      if (steps) {
        message.success("Success !!!");
        setStepList(steps as Step[]);
      } else {
        message.error("Is not possible with these Jars");
      }
    } else {
      message.warn("Please fill all fields");
    }
    setLoading(false);
  };

  const onRemove = (id: number) => {
    let obj = Object.assign({}, jarMap);
    delete obj[id];
    setJarMap(obj);
  };

  const onChangeInfo = (id: number, field: string, value: string | number) => {
    const target = jarMap[id];
    setJarMap({ ...jarMap, [id]: { ...target, [field]: value } });
  };

  const onCreateJar = () => {
    let maxId = Object.values(jarMap).length
      ? Math.max.apply(
          null,
          Object.values(jarMap).map(({ id }) => id)
        ) + 1
      : 1;
    setJarMap({
      ...jarMap,
      [maxId]: { id: maxId, currentSize: 0, name: "", maxSize: 0 }
    });
    console.log(jarMap);
  };
  return (
    <Container>
      <>
        <Header>
          <label>{"Target Size:"}</label>
          <Input
            value={targetSize}
            style={{ width: "300px", margin: "0 20px" }}
            loading={loading}
            onChange={(e) => {
              setTargetSize(Number(e.target.value));
            }}
          />
          <Button
            type={"primary"}
            onClick={onCreateJar}
            loading={loading}
            disabled={Object.values(jarMap).length >= limit}
          >
            Add Jar
          </Button>
        </Header>
        <CardList>
          {!hasFailed && !stepList.length ? (
            <Row gutter={[16, 16]}>
              {Object.values(jarMap).map(({ id, name, maxSize }: Jar) => (
                <Col span={8} key={id}>
                  <Card
                    title={name || `Jar Name ${id}`}
                    key={id}
                    extra={
                      <Button
                        type={"link"}
                        style={{ color: "red", padding: "0 0 0px 15px" }}
                        onClick={() => onRemove(id)}
                      >
                        Remove
                      </Button>
                    }
                  >
                    <Form name="basic" validateTrigger={["onChange", "onBlur"]}>
                      <Form.Item
                        label="Name"
                        name="name"
                        initialValue={name}
                        rules={[
                          {
                            required: true,
                            message: "Please input Jar's name!"
                          }
                        ]}
                      >
                        <Input
                          onChange={(e) =>
                            onChangeInfo(id, "name", e.target.value)
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        label="Max Size"
                        initialValue={maxSize}
                        name="maxSize"
                        rules={[
                          {
                            required: true,
                            pattern: new RegExp(/^[0-9]*$/),
                            message: "Please input Jar's max size!"
                          }
                        ]}
                      >
                        <Input
                          onChange={(e) =>
                            onChangeInfo(id, "maxSize", Number(e.target.value))
                          }
                        />
                      </Form.Item>

                      <Checkbox
                        checked={id === targetJar}
                        onChange={() => setTargetJar(id)}
                      >
                        Is Target Jar
                      </Checkbox>
                    </Form>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <StepList data={stepList} />
          )}
        </CardList>
        <FixedBar>
          <Button
            type={"primary"}
            htmlType={"submit"}
            loading={loading}
            onClick={onClickButton}
            disabled={hasFailed}
          >
            {"Start"}
          </Button>

          {stepList.length && !hasFailed ? (
            <Button
              type={"link"}
              style={{ margin: "0 10px" }}
              onClick={() => {
                setHasFailed(false);
                setStepList([]);
              }}
            >
              {"Reset"}
            </Button>
          ) : null}
        </FixedBar>
      </>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

const CardList = styled.div`
  width: 100%;
  height: calc(90vh - 50px);
  overflow-y: auto;
  padding: 5px 10px;
`;
const Header = styled.div`
  width: 100%;
  height: 10vh;
  box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.25);
  border: 1px solid #eee;
  z-index: 50;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;
const FixedBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  background: #ccc;
  padding: 0 10px;
  height: 50px;
`;
