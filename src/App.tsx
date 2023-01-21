import * as React from "react";
import _, { isNumber } from "lodash";
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
  Modal,
} from "antd";
import StepList from "./components/StepsList/StepsList";
import { deepSearch } from "./utils/deepSearch";
import { backTrackingSearch } from "./utils/backTrackingSearch";
import { orderedSearch } from "./utils/orderedSearch";
import { greedySearch } from "./utils/greedySearch";
import { breadthSearch } from "./utils/breadthFirstSearch";
import { iteratedSearch } from "./utils/iteratedSearch";

import { JarMap, Step, Jar } from "./types";

const limit = 2;
const options = [
  //{ label: "Backtracking", value: "backtracking" },
  //{ label: "Breadth First", value: "breadth" },
  { label: "Depth First", value: "depth" },
  //{ label: "Ordered Search", value: "ordered" },
  //{ label: "Greedy Search", value: "greedy" },
  //{ label: "Iterated Search", value: "iterated" },
];
export default function App() {
  const [jarMap, setJarMap] = React.useState<JarMap>({});
  const [targetJar, setTargetJar] = React.useState<number>();
  const [targetSize, setTargetSize] = React.useState<number>();
  const [stepList, setStepList] = React.useState<Step[]>([]);
  const [hasFailed, setHasFailed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [method, setMethod] = React.useState(options[0].value);
  const [maxLevel, setMaxLevel] = React.useState<number>();
  const [modalView, setModalView] = React.useState(false);

  const checkIntegrity = () => {
    for (const { name, maxSize } of Object.values(jarMap)) {
      if (!name || !maxSize) {
        return false;
      }
    }
    return true;
  };

  const onClickButton = () => {
    try {
      if (
        !checkIntegrity() ||
        !isNumber(targetSize) ||
        !targetJar ||
        (method === "iterated" && !isNumber(maxLevel))
      ) {
        throw new Error("Please fill all fields");
      }
      const jarList: Jar[] = _.cloneDeep(Object.values(jarMap));
      let result: any;

      switch (method) {
        case "depth":
          result = deepSearch(
            jarList,
            targetSize as number,
            _.cloneDeep(jarMap[targetJar as number]),
            [jarList.map(({ currentSize }) => currentSize)] as any,
          );
          break;
        case "backtracking":
          result = backTrackingSearch(
            jarList,
            targetSize as number,
            jarList.find((jar: Jar) => jar.id === targetJar) as Jar,
          );
          break;
        case "breadth":
          result = breadthSearch(
            jarList,
            targetSize as number,
            jarList.find((jar: Jar) => jar.id === targetJar) as Jar,
          );
          break;
        case "ordered":
          result = orderedSearch(jarList, targetSize as number, targetJar);
          break;
        case "greedy":
          result = greedySearch(jarList, targetSize as number, targetJar);
          break;
        case "iterated":
          result = iteratedSearch(
            jarList,
            targetSize as number,
            jarList.find((jar: Jar) => jar.id === targetJar) as Jar,
            maxLevel as number,
          );
          break;
      }

      result?.then((steps: Step[]) => {
        if (steps) {
          message.success("Success !!!");
          setStepList(steps);
        } else {
          message.error("Is not possible with these Jars");
        }
      });
      setLoading(false);
    } catch (error) {
      message.warn(error);
    }
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
              id={'targetSize'}
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
              id={'addJar'}
              disabled={Object.values(jarMap).length >= limit}
            >
              Add Jar
            </Button>
          </div>
          <div>
            <Button
              type={"primary"}
              onClick={() => setModalView(true)}
              loading={loading}
            >
              Settings
            </Button>
          </div>

          <Modal
            title="Settings"
            visible={modalView}
            onOk={() => setModalView(false)}
            onCancel={() => setModalView(false)}
          >
            <ModalContainer>
              <ModalItem>
                <label>{"Method:"}</label>
                <Select
                  style={{ width: "300px" }}
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
              </ModalItem>
              <ModalItem>
                {method === "iterated" ? (
                  <>
                    <label>{"Max Level:"}</label>
                    <InputNumber
                      value={maxLevel}
                      style={{ width: "300px" }}
                      disabled={loading}
                      onChange={(value) => {
                        setMaxLevel(Number(value));
                      }}
                    />
                  </>
                ) : null}
              </ModalItem>
            </ModalContainer>
          </Modal>
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
                    <Form name={`basic-${id}`} validateTrigger={["onChange", "onBlur"]}>
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
                          id={`name-${id}`}
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
                          id={`maxSize-${id}`}
                          onChange={(e) =>
                            onChangeInfo(id, "maxSize", Number(e.target.value))
                          }
                        />
                      </Form.Item>

                      <Checkbox
                        checked={id === targetJar}
                        id={`target-${id}`}
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
            id={'start'}
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
    </Container >
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

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 80px;
`;

const ModalItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;
