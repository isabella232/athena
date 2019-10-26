/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// node
const path = require('path');

// external
const expect = require('chai').expect;
const assert = require('assert');
const sinon = require('sinon');
const List = require('list/methods');

// project
const EntityManager = require('./../../src/managers/entityManager');

/**
 * Builds the tests directory path for a given subdirectory.
 * @param {string} finalPath The final path element.
 * @return {string} The final path.
 */
function makeTestsDirPath(finalPath) {
  return path.resolve(
      './',
      'tests',
      'entityManager',
      'config',
      finalPath
  );
}

/**
 * EntityManager._parseEntities stub handlers.
 */

let EntitiesManagerParseEntityStub;

/**
 * Creates handler that stubs the _parseEntities method.
 * @return {Function} The handler function.
 */
function makeStubParseEntitiesHandler() {
  return function() {
    EntitiesManagerParseEntityStub = sinon.stub(
        EntityManager.prototype,
        '_parseEntities'
    ).returns(0);
  };
}

/**
 * Creates a handler that restores the _parseEntities stubbed method.
 * @return {Function} The handler function.
 */
function makeRestoreParseEntitiesHandler() {
  return function() {
    EntitiesManagerParseEntityStub.restore();
  };
}

describe('EntityManager', function() {
  describe('constructor', function() {
    beforeEach(makeStubParseEntitiesHandler());
    afterEach(makeRestoreParseEntitiesHandler());

    it('should set the settings', function() {
      const expectedSettings = {expected: true};
      const EntityManagerInstance = new EntityManager(expectedSettings);

      expect(EntityManagerInstance.settings).to.equal(expectedSettings);
    });

    it('should define the pre-parsed entities', function() {
      const EntityManagerInstance = new EntityManager({});

      expect(EntityManagerInstance.entities.length).to.eql(0);
    });

    it('should create a container for the final entities', function() {
      const EntityManagerInstance = new EntityManager({});

      expect(EntityManagerInstance.entities).to.have.property('bits');
      expect(EntityManagerInstance.entities).to.have.property('offset');
      expect(EntityManagerInstance.entities).to.have.property('length');
      expect(EntityManagerInstance.entities).to.have.property('prefix');
      expect(EntityManagerInstance.entities).to.have.property('root');
      expect(EntityManagerInstance.entities).to.have.property('suffix');
    });

    it('should attempt to parse all entities', function() {
      const expectedSettings = {expected: true};
      const EntityManagerInstance = new EntityManager(expectedSettings);

      assert(EntityManagerInstance._parseEntities.called);
    });
  });

  describe('_getTestFiles', function() {
    beforeEach(makeStubParseEntitiesHandler());
    afterEach(makeRestoreParseEntitiesHandler());

    it('should deep search for test files in a given directory', function() {
      const mockSettings = {
        testsDirPath: makeTestsDirPath('getTestFiles'),
      };
      const EntityManagerInstance = new EntityManager(mockSettings);
      const testFiles = EntityManagerInstance._getTestFiles();

      expect(testFiles).to.be.an('array');
      expect(testFiles.length).to.equal(2);
    });
  });

  describe('_parseAllTestFiles', function() {
    beforeEach(makeStubParseEntitiesHandler());
    afterEach(makeRestoreParseEntitiesHandler());

    it('should parse all existent test files', function() {
      const mockSettings = {
        testsDirPath: makeTestsDirPath('getTestFiles'),
      };
      const EntityManagerInstance = new EntityManager(mockSettings);

      EntityManagerInstance._parseAllTestFiles();

      expect(EntityManagerInstance.testFiles.length).to.equal(2);
    });

    it('should instantiate a new TestFile for each test file', function() {
      const mockSettings = {
        testsDirPath: makeTestsDirPath('getTestFiles'),
      };
      const EntityManagerInstance = new EntityManager(mockSettings);

      EntityManagerInstance._parseAllTestFiles();

      expect(EntityManagerInstance.testFiles[0].constructor.name).to.equal('TestFile');
    });
  });

  describe('_parseFunctionalSuites', function() {
    beforeEach(makeStubParseEntitiesHandler());
    afterEach(makeRestoreParseEntitiesHandler());

    it('should filter and parse only suite types', function() {
      const mockSettings = {
        testsDirPath: makeTestsDirPath('parseFunctionalSuites'),
      };
      const EntityManagerInstance = new EntityManager(mockSettings);

      EntityManagerInstance._parseAllTestFiles();
      EntityManagerInstance._parseFunctionalSuites();

      expect(EntityManagerInstance.entities.length).to.equal(1);
      expect(List.first(EntityManagerInstance.entities).config.type).to.equal('suite');
    });
  });

  describe('_parseFixtures', function() {
    beforeEach(makeStubParseEntitiesHandler());
    afterEach(makeRestoreParseEntitiesHandler());

    it('should filter and parse only fixture types', function() {
      const mockSettings = {
        testsDirPath: makeTestsDirPath('parseFixtures'),
      };
      const EntityManagerInstance = new EntityManager(mockSettings);

      EntityManagerInstance._parseAllTestFiles();
      EntityManagerInstance._parseFixtures();

      expect(EntityManagerInstance.entities.length).to.equal(1);
      expect(List.first(EntityManagerInstance.entities).config.type).to.equal('fixture');
    });
  });

  describe('_parsePerfRuns', function() {
    beforeEach(makeStubParseEntitiesHandler());
    afterEach(makeRestoreParseEntitiesHandler());

    it('should filter and parse only perfRun types', function() {
      const mockSettings = {
        testsDirPath: makeTestsDirPath('parsePerfRuns'),
      };
      const EntityManagerInstance = new EntityManager(mockSettings);

      EntityManagerInstance._parseAllTestFiles();
      EntityManagerInstance._parsePerfRuns();

      expect(EntityManagerInstance.entities.length).to.equal(1);
      expect(List.first(EntityManagerInstance.entities).config.type).to.equal('perfRun');
    });
  });

  describe('_parseFunctionalTests', function() {
    beforeEach(makeStubParseEntitiesHandler());
    afterEach(makeRestoreParseEntitiesHandler());

    it('should start by parsing all functional suites first', function() {
      const mockSettings = {
        testsDirPath: makeTestsDirPath('parseFunctionalSuites'),
      };
      const EntityManagerInstance = new EntityManager(mockSettings);
      const spy = sinon.spy(EntityManagerInstance, '_parseFunctionalTests');

      EntityManagerInstance._parseFunctionalTests();
      assert(spy.called);
    });
  });
});
