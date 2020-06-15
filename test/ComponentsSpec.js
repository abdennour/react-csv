import jsdom from 'jsdom-global';
import React from 'react';
import {
 mount,
 shallow
} from 'enzyme';
import sinon from 'sinon';
import expect from 'expect';

import {
 CSVLink,
 CSVDownload
} from '../src';
import { buildURI, toCSV } from '../src/core';
import 'console-info';


const getAttrs =((htmlElment) => Array.from(
    htmlElment.attributes
  ).reduce((a, b) => {
      a[b.name ==='class' ? 'className':b.name ] = b.value ;
      return a;}
   , {})
);

describe('In browser environment', () => {
  before(function () {
    this.jsdom = require('jsdom-global')()
  })
  
  after(function () {
    this.jsdom()
  })

  describe('CSVLink', () => {
    let minProps;
    beforeEach(() => {
     minProps = {
      data: [
       ['X', 'Y'],
       ['1', '2'],
       ['3', '4']
      ]
     };
    });
 
    it(`renders without error if required props are passed`, () => {
      const wrapper = shallow( <CSVLink {...minProps} > Click here </CSVLink>);
       expect(wrapper.length).toEqual(1);
    });
 
    it(`has comma as default separator `, () => {
      const wrapper = mount( <CSVLink {...minProps} > Click here </CSVLink>);
      expect(wrapper.props().separator).toEqual(',');
    })
 
    it(`assigns a download filename`, () => {
      const filename= "persons.csv";
      const wrapper = mount( <CSVLink {...minProps} filename={filename} > here </CSVLink>);
      expect(wrapper.find('a').get(0).getAttribute('download')).toEqual(filename);
    });
 
     it(`renders anchor tag`, () => {
       const wrapper = shallow( <CSVLink {...minProps} > Click here </CSVLink>);
        expect(wrapper.find('a').length).toEqual(1);
      });
 
 
 
     it(`calls "buildURI" method on mounting`, () => {
       const dataURI = `data:text/csv;some,thing`
       const buildURI = sinon.stub(CSVLink.prototype, 'buildURI').returns(dataURI);
       const wrapper = mount( <CSVLink {...minProps} > Click here </CSVLink>);
       expect(buildURI.calledOnce).toBeTruthy();
       buildURI.restore();
     });

     it(`calls "buildURI" method on update`, () => {
      const dataURI = `data:text/csv;some,thing`
      const buildURI = sinon.stub(CSVLink.prototype, 'buildURI').returns(dataURI);
      const wrapper = mount( <CSVLink data={[]} > Click here </CSVLink>);
      expect(buildURI.calledOnce).toBeTruthy();
      minProps.data.push(['x','y']);
      wrapper.update()
      expect(buildURI.calledTwice).toBeTruthy();
      buildURI.restore();
    });

     it(`generates CSV download link and bind it to "href" of <a> element`, () => {
       const linkPrefix = `data:text/csv`
       const wrapper = mount( <CSVLink {...minProps} > Click here </CSVLink>);
       const actualLink = wrapper.find(`a`).get(0).getAttribute('href');
       expect(actualLink.startsWith(linkPrefix)).toBeTruthy();
     });
 
      it(`forwards props to anchor tag unless props is forbidden`, () => {
       const extraProps = {
         className:`btn`,
         target:'_self'
       };
       const wrapper = mount( <CSVLink {...Object.assign(minProps, extraProps)} > Click here </CSVLink>);
       const actualAnchorAttrs =getAttrs(wrapper.find(`a`).get(0));
      expect(actualAnchorAttrs).toInclude(extraProps);
 
     })
 
     it(`generates "onClick" event for IE11 support`, () => {
       const wrapper = shallow( <CSVLink {...minProps}> here </CSVLink>);
       wrapper.find(`a`).simulate(`click`, { preventDefault() {}})
       expect(wrapper.find(`a`).get(0).props).toContainKey('onClick');
     });

    describe('handleLegacy for IE11', () => {
      it('stops propagation and uses props for up-to-date values', () => {
        const data = 'Strongback,Tirimo';
        const headers = ['use-caste', 'comm'];
        const separator = ',';
        const filename = 'SyeniteFulcrum';
        const enclosingCharacter = '"';
        const newLineSeparator = '\n';

        const wrapper = shallow(<CSVLink {...{data, headers, separator, filename, enclosingCharacter, newLineSeparator}} />);
        const instance = wrapper.instance();

        // create spies
        const preventDefault = sinon.spy();
        window.navigator.msSaveBlob = sinon.spy();
        const toCSVSpy = sinon.spy(toCSV);

        // the following is set to true to mimic IE 11
        window.navigator.msSaveOrOpenBlob = true;
        // call the class function
        instance.handleLegacy({ preventDefault });

        expect(preventDefault.called).toBeTruthy;
        expect(toCSVSpy.calledWith([data, headers, separator, enclosingCharacter, newLineSeparator])).toBeTruthy;
        expect(window.navigator.msSaveBlob.calledWith(filename)).toBeTruthy;
      });
    });
     // TODO write unit-tests for handleClick
     // TODO write unit-tests for handleSyncClick
     // TODO write unit-tests for handleAsyncClick
 
    }); 
 
   describe('CSVDownload', () => {
     let minProps;
     let manyProps;
     beforeEach(() => {
      minProps = {
       data: [
        ['X', 'Y'],
        ['1', '2'],
        ['3', '4']
       ],
       uFEFF: true
      };
      manyProps= Object.assign(minProps, {
       target: '_blank',
       specs: 'fullscreen=yes&height=200&status=yes',
       replace:'no'
      });
     });
 
     it(`does not render anything by default`, () => {
       const wrapper = shallow( <CSVDownload {...minProps} />);
        expect(wrapper.props().children).toNotExist();
       });
      it(`calls "buildURI" on mounting`, () => {
        const dataURI = `data:text/csv;some,thing`
        const buildURI = sinon.stub(CSVDownload.prototype, 'buildURI').returns(dataURI);
        const wrapper = mount( <CSVDownload {...minProps} />);
        expect(buildURI.calledOnce).toBeTruthy();
        buildURI.restore();
      });
      it(`redirects in different page on mounting`, () => {
        const openCallback = sinon.stub(window,'open').returns({
          focus: ()=> {}
        });
        const wrapper = mount( <CSVDownload {...manyProps} />);
        expect(openCallback.calledWith(buildURI(manyProps.data, manyProps.uFEFF), manyProps.target, manyProps.specs, manyProps.replace)).toBeTruthy();
        expect(openCallback.calledOnce).toBeTruthy();
        openCallback.restore();
       });
 
      it(`persists new opened window`, () => {
        const openCallback = sinon.stub(window,'open').returns('newPage');
        const wrapper = mount( <CSVDownload {...manyProps} />);
        const actualNewWindow= wrapper.instance().getWindow();
        expect(actualNewWindow).toEqual('newPage');
        openCallback.restore();
 
     });
  });
 
})

describe('In Node environment', () => {
  it('does not call buildURI', () => {
    const minProps = {
      data: [
       ['X', 'Y'],
       ['1', '2'],
       ['3', '4']
      ]
    };

    const dataURI = `data:text/csv;some,thing`
    const buildURI = sinon.stub(CSVLink.prototype, 'buildURI').returns(dataURI);
    const wrapper = shallow( <CSVLink {...minProps} > Click here </CSVLink>);
    expect(buildURI.notCalled).toBeTruthy();
    buildURI.restore();
  });
});