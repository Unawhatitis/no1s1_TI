pragma solidity >=0.5.16;
contract Transfer {
  address from;
  address payable to;
  constructor(){
    from = msg.sender;
  }

  event Pay(address _to, address _from, uint amt);
  function pay( address payable _to ) public payable returns
  (bool) {
    to = _to;
    to.transfer(msg.value);
    emit Pay(to, from, msg.value);
    return true;
  }

//   function payb( address _to ) public payable returns
//   (bool) {
//     to = payable(address(uint160(_to)));
//     to.transfer(msg.value);
//     emit Pay(to, from, msg.value);
//     return true;
//   }

    

}
