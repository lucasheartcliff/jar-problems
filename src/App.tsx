import * as React from "react";
import _ from "lodash";
import styled from "styled-components";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  message,
  Spin,
  InputNumber,
  Select,
} from "antd";
import StepList from "./components/StepsList/StepsList";
import { deepSearch } from "./utils/deepSearch";
import { breadthFirstSearch } from "./utils/breadthFirstSearch";
import { orderedSearch } from "./utils/orderedSearch";
import { greedySearch } from "./utils/greedySearch";
import { JarMap, Step, Jar,History } from "./types";

const limit = 10;
const options = [
  { label: "Breadth First Search", value: "breadthFirst" },
  { label: "Depth Search", value: "depth" },
  { label: "Ordered Search", value: "ordered" },
  { label: "Greedy Search", value: "greedy" },
];
export default function App() {
  const [jarMap, setJarMap] = React.useState<JarMap>({});
  const [targetJar, setTargetJar] = React.useState<number>();
  const [targetSize, setTargetSize] = React.useState<number>();
  const [stepList, setStepList] = React.useState<Step[]>([]);
  const [hasFailed, setHasFailed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [method, setMethod] = React.useState(options[0].value);

  const checkIntegrity = () => {
    for (const { name, maxSize } of Object.values(jarMap)) {
      if (!name || !maxSize) {
        return false;
      }
    }
    return true;
  };

  const onClickButton = () => {
    if (checkIntegrity() && !isNaN(targetSize as number) && targetJar) {
      const jarList: Jar[] = _.cloneDeep(Object.values(jarMap));
      let result: any;
      if (method === "depth") {
        result = deepSearch(
          jarList,
          targetSize as number,
          _.cloneDeep(jarMap[targetJar as number]),
          [jarList.map(({ currentSize }) => currentSize)] as any,
        );
      } else if (method === "breadthFirst") {
        result = breadthFirstSearch(
          jarList,
          targetSize as number,
          jarList.find((jar: Jar) => jar.id === targetJar) as Jar,
        );
      } else if (method === "ordered") {
        result = orderedSearch(jarList, targetSize as number, targetJar);
      } else if (method === "greedy") {
        result = greedySearch(jarList, targetSize as number, targetJar);
      }

      result.then((steps: Step[]) => {
        if (steps) {
          message.success("Success !!!");
          setStepList(steps);
        } else {
          message.error("Is not possible with these Jars");
        }
      });
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
          Object.values(jarMap).map(({ id }) => id),
        ) + 1
      : 1;
    setJarMap({
      ...jarMap,
      [maxId]: { id: maxId, currentSize: 0, name: "", maxSize: 0 },
    });
  };

  return (
    <Container>
      <Spin spinning={loading}>
        <Header>
          <div>
            <label>{"Target Size:"}</label>
            <InputNumber
              value={targetSize}
              style={{ width: "300px", margin: "0 20px" }}
              disabled={loading}
              onChange={(value) => {
                setTargetSize(Number(value));
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
          </div>
          <div>
            <label style={{ marginLeft: 30 }}>{"Method:"}</label>
            <Select
              style={{ margin: "0 10px", width: 250 }}
              value={method}
              onChange={(value: string) => {
                return setMethod(value);
              }}
            >
              {options.map(({ value, label }, index) => (
                <Select.Option key={index} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </div>
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
                        key={id}
                        label="Name"
                        name="name"
                        initialValue={name}
                        rules={[
                          {
                            required: true,
                            message: "Please input Jar's name!",
                          },
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
                            message: "Please input Jar's max size!",
                          },
                        ]}
                      >
                        <Input
                          key={id}
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
            onClick={() => {
              setLoading(true);
              setTimeout(() => onClickButton(), 1000);
            }}
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
      </Spin>
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
  justify-content: space-between;
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
