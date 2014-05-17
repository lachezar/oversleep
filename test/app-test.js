buster.spec.expose();
var expect = buster.referee.expect;
var assert = buster.referee.assert;

describe("App", function () {

  var clone = function(o) {
    return JSON.parse(JSON.stringify(o));
  };

  var sample = {entries: {
    '20140501': 2,
    '20140502': 1,
    '20140430': 5
  }};
  
  var faultySampleMinutes = {entries: {
    '20140430': 26*60
  }};
  
  var faultySampleZeroMinutes = {entries: {
    '20140420': 0
  }};
  
  var faultySampleDate = {entries: {
    '20140433': 2
  }};
  
  var initialSample = {entries: {}};
  
  before(function() {
    simpleStorage.flush();
    
    this.stub(window, "handleSanitizationError");
  });

  itEventually("notifies if the localStorage is unavailable", function () {
    localStorage = void 0;
    //buster.assert.equals(20, 22);

    getUserData();
  });

  it("creates new overtime state if none is existing yet", function () {
    expect(getUserData()).toEqual(initialSample);
  });

  it("loads the overtime state from storage", function () {
    simpleStorage.set(USER_DATA_KEY, sample);
    expect(getUserData()).toEqual(sample);
  });

  it("loads only correct overtime data from the storage", function () {
    simpleStorage.set(USER_DATA_KEY, faultySampleMinutes);
    expect(getUserData()).toEqual(initialSample);
  });

  it("stores the overtime state in storage", function () {
    updateUserData(sample);
    expect(getUserData()).toEqual(sample);
  });
  
  it("sanitizes the overtime data", function () {
    expect(sanitizeUserData(faultySampleZeroMinutes)).toEqual(initialSample);
    expect(sanitizeUserData(faultySampleMinutes)).toEqual(initialSample);
    expect(sanitizeUserData(faultySampleDate)).toEqual(initialSample);
    expect(sanitizeUserData(sample)).toEqual(sample);
    assert.calledThrice(handleSanitizationError);
  });
  
  it("adds new overtime data entry", function () {
    this.spy(window, "isEntryValid");
    var data = clone(sample);
    addUserDataEntry('20140601', 60, data);
    expect(data.entries['20140601']).toEqual(60);
    assert.calledOnce(isEntryValid);
  });
  
  it("rejects new overtime data entry if it is invalid", function () {
    this.spy(window, "isEntryValid");
    var data = clone(sample);
    expect(function() {addUserDataEntry('20140601', 6000, data);}).toThrow("Error");
    assert.calledOnce(isEntryValid);
  });

  
  it("updates existing overtime entry", function () {
    var data = clone(sample);
    addUserDataEntry('20140501', 120, data);
    expect(data.entries['20140501']).toEqual(120);
    expect(data.entries['20140502']).toEqual(1);
    expect(data.entries['20140601']).not.toBeDefined();
  });
  
  it("calculates overtime by months", function () {
    expect(totalOvertimeByMonths(sample)).toEqual({'201405': 3, '201404': 5});
  });
  
  it("calculates overtime for this month", function () {
      expect(totalOvertimeThisMonth(new Date(2014, 4, 1), sample)).toEqual(3);
      expect(totalOvertimeThisMonth(new Date(2014, 7, 1), sample)).toEqual(0);
  });
  
  it("orders overtime by date for a given month", function () {
      expect(overtimeDaily('201405', sample)).toEqual([['20140501', 2], ['20140502', 1]]);
      expect(overtimeDaily('201404', sample)).toEqual([['20140430', 5]]);
      expect(overtimeDaily('201407', sample)).toEqual([]);
  });
    
});
