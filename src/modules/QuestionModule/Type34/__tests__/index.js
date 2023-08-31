import React from "react";
import renderer from "react-test-renderer";

import Type01 from "../index";

test("type 01 module in ames247", () => {
  const component = renderer.create(
    <Type01
      word={""}
      imageURL={""}
      audioURL={""}
      kindOfWord={""}
      onNext={() => {}}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
