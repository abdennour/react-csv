import jsdom from "jsdom-global";
import React from "react";
import { mount, shallow, render } from "enzyme";
import sinon from "sinon";
import expect from "expect";

import { CSVLink, CSVDownload } from "../src";
import { buildURI } from "../src/core";
import "console-info";

const getAttrs = htmlElment =>
  Array.from(htmlElment.attributes).reduce((a, b) => {
    a[b.name === "class" ? "className" : b.name] = b.value;
    return a;
  }, {});

describe("In browser environment", () => {
  before(function() {
    this.jsdom = require("jsdom-global")();
  });

  after(function() {
    this.jsdom();
  });

  describe("CSVLink", () => {
    let minProps;
    beforeEach(() => {
      minProps = {
        data: [["X", "Y"], ["1", "2"], ["3", "4"]],
      };
    });

    it(`renders without error if required props are passed`, () => {
      const wrapper = shallow(<CSVLink {...minProps}> Click here </CSVLink>);
      expect(wrapper.length).toEqual(1);
    });

    it(`has comma as default separator `, () => {
      const wrapper = mount(<CSVLink {...minProps}> Click here </CSVLink>);
      expect(wrapper.props().separator).toEqual(",");
    });

    it(`assigns a download filename`, () => {
      const filename = "persons.csv";
      const wrapper = mount(
        <CSVLink {...minProps} filename={filename}>
          {" "}
          here{" "}
        </CSVLink>
      );
      expect(
        wrapper
          .find("a")
          .get(0)
          .getAttribute("download")
      ).toEqual(filename);
    });

    it(`renders anchor tag`, () => {
      const wrapper = shallow(<CSVLink {...minProps}> Click here </CSVLink>);
      expect(wrapper.find("a").length).toEqual(1);
    });

    it(`calls "getURI" method on mounting`, () => {
      const dataURI = `data:text/csv;some,thing`;
      const getURI = sinon
        .stub(CSVLink.prototype, "getURI")
        .returns(dataURI);
      const wrapper = mount(<CSVLink {...minProps}> Click here </CSVLink>);
      expect(getURI.calledOnce).toBeTruthy();
      getURI.restore();
    });
    it(`generates CSV download link and bind it to "href" of <a> element`, () => {
      const linkPrefix = `data:text/csv`;
      const wrapper = mount(<CSVLink {...minProps}> Click here </CSVLink>);
      const actualLink = wrapper
        .find(`a`)
        .get(0)
        .getAttribute("href");
      expect(actualLink.startsWith(linkPrefix)).toBeTruthy();
    });

    it(`forwards props to anchor tag unless props is forbidden`, () => {
      const extraProps = {
        className: `btn`,
        target: "_self",
      };
      const wrapper = mount(
        <CSVLink {...Object.assign(minProps, extraProps)}> Click here </CSVLink>
      );
      const actualAnchorAttrs = getAttrs(wrapper.find(`a`).get(0));
      expect(actualAnchorAttrs).toInclude(extraProps);
    });

    it(`generates "onClick" event for IE11 support`, () => {
      const wrapper = shallow(<CSVLink {...minProps}> here </CSVLink>);
      wrapper.find(`a`).simulate(`click`, { preventDefault() {} });
      expect(wrapper.find(`a`).get(0).props).toContainKey("onClick");
    });
    // TODO write unit-tests for handleClick
    // TODO write unit-tests for handleSyncClick
    // TODO write unit-tests for handleAsyncClick
  });

  describe("CSVDownload", () => {
    let minProps;
    beforeEach(() => {
      minProps = {
        data: [["X", "Y"], ["1", "2"], ["3", "4"]],
        uFEFF: true,
      };
    });

    it(`does not render anything by default`, () => {
      const wrapper = shallow(<CSVDownload {...minProps} />);
      expect(wrapper.props().children).toNotExist();
    });

    it(`calls "handleRef" on mounting`, () => {
      const handleRef = sinon.stub(CSVDownload.prototype, "handleRef");
      mount(<CSVDownload {...minProps} />);
      expect(handleRef.calledOnce).toBeTruthy();
      handleRef.restore();
    });

    it(`on mounting no element in dom`, () => {
      const filename = "persons.csv";
      const handleRef = sinon.stub(CSVDownload.prototype, "handleRef");
      const wrapper = mount(<CSVDownload {...minProps} filename={filename} />);
      expect(
        wrapper
          .find("a")
          .get(0)
          .getAttribute("download")
      ).toEqual(filename);
      handleRef.restore();
    });
  });
});
