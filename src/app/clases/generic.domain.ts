export class Field {
  constructor(
    public name : string,
    public label : string,
    public type : string
  ) { }
}
export class AdvancedSearch {
  constructor(
    public filterByRule : SearchRule,
    public orderByRule : SearchRule,
    public rangeRule : SearchRule
  ) { }
}
export class SearchRule {
  constructor(
    public rule : string,
    public description : string,
    public separator : string,
    public commands : SearchOperator[]
  ) { }
}
export class SearchOperator {
  constructor(
    public symbol : string,
    public description : string,
    public value : string,
    public type : string
  ) { }
}
export class SearchRow {
  constructor(
    public rule : string,
    public edited : boolean,
    public field : string,
    public operator : string,
    public value : string,
    public sentence : string,
    public encodedSentence : string,
    public validation : boolean,
    public validationComment : string
  ) { }
}

export class UriControl {
  constructor(
    public serviceProvider : string,
    public pathParameters : [number, string][],
    public queryParameters : [string, string][]
  ) { }
}

export class ConfirmationModalOptions {
  constructor(
    public title : string,
    public message : string,
    public forwardLabel : string,
    public dismissLabel : string,
    public icon : string,
    public disabled : boolean,
    public response : boolean
  ) { }
}

export class AlertObject {
  constructor(
    public message : string,
    public type : string,
    public dismissible : boolean,
    public lifetime : number
  ) { }

  resolveColor(){
    if(this.type === 'success'){
      return "#739E73";
    }
    else if(this.type === 'danger'){
      return "#C46A69"
    }
    else if(this.type === 'warning'){
      return "#C79121"
    }
    else if(this.type === 'info'){
      return "#3276B1"
    }
    else{
      return "#3276B1"
    }
  }

  resolveIcon(){
    if(this.type === 'success'){
      return "fa fa-check";
    }
    else if(this.type === 'danger'){
      return "fa fa-times"
    }
    else if(this.type === 'warning'){
      return "fa fa-warning"
    }
    else if(this.type === 'info'){
      return "fa fa fa-info"
    }
    else{
      return "fa fa fa-info"
    }
  }
}

