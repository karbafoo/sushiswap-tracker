// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.12;


contract SushiApiTracker {
    struct SwapRecord {
         address input;
         address output;
         uint amount0Out;
         uint amount1Out;
         address to;
         uint timestamp;
    }
    struct LiquidityRecord {
         address tokenA;
         address tokenB;
         uint amountA;
         uint amountB;
         address to;
         uint timestamp;
    }

    mapping(uint => SwapRecord[]) public swapRecords;
    mapping(uint => LiquidityRecord[]) public liquidityRecords;



   function swap(
       uint api_key,
       address _input,
       address _output,
       uint _amount0Out,
       uint _amount1Out,
       address _to) public  {
         swapRecords[api_key].push(SwapRecord({
             input: _input,
             output: _output,
             amount0Out: _amount0Out,
             amount1Out: _amount1Out,
             to: _to,
             timestamp: block.timestamp
          }));
   }
   function liquidity(uint api_key, address _tokenA, address _tokenB, uint _amountA, uint _amountB, address _to) public {
      liquidityRecords[api_key].push(LiquidityRecord({
               tokenA: _tokenA,
               tokenB: _tokenB,
               amountA: _amountA,
               amountB: _amountB,
               to: _to,
               timestamp: block.timestamp
        }));
   }

    function getSwapRecords(uint api_key) public view returns (uint[6][] memory){
      return swapRecordToArray(swapRecords[api_key]);
    }


    function getSwapRecordsByInputToken(uint api_key, address _token) public view returns (uint[6][] memory){
      uint arrayLength = swapRecords[api_key].length;
      uint recCount = 0;
      for(uint i=0; i < arrayLength; i++) {
          if(swapRecords[api_key][i].input == _token){
              recCount++;
          }
      }
      SwapRecord[] memory records = new SwapRecord[](recCount);
      uint filterIndex = 0;
      for(uint i=0; i < arrayLength; i++) {
          if(swapRecords[api_key][i].input == _token){
              records[filterIndex] = swapRecords[api_key][i];
              filterIndex++;
          }
      }
      return swapRecordToArray(records);
    }

    function getSwapRecordsByOutputToken(uint api_key, address _token) public view returns (uint[6][] memory){
      uint arrayLength = swapRecords[api_key].length;
      uint recCount = 0;
      for(uint i=0; i < arrayLength; i++) {
          if(swapRecords[api_key][i].output == _token){
              recCount++;
          }
      }
      SwapRecord[] memory records = new SwapRecord[](recCount);
      uint filterIndex = 0;
      for(uint i=0; i < arrayLength; i++) {
          if(swapRecords[api_key][i].output == _token){
              records[filterIndex] = swapRecords[api_key][i];
              filterIndex++;
          }
      }
      return swapRecordToArray(records);
    }

    function getTotalSwapAmount(uint api_key, address _token) public view returns (uint inputTotal, uint outputTotal){
      uint arrayLength = swapRecords[api_key].length;
      for(uint i=0; i < arrayLength; i++) {
          if(swapRecords[api_key][i].input == _token){
              inputTotal += swapRecords[api_key][i].amount0Out;
          }
            if(swapRecords[api_key][i].output == _token){
              outputTotal += swapRecords[api_key][i].amount1Out;
          }
      }
    }


    function swapRecordToArray(SwapRecord[] memory records) private pure returns (uint[6][] memory){
      uint arrayLength = records.length;
      uint[6][] memory recs = new uint[6][](arrayLength);
      for(uint i=0; i < arrayLength; i++) {
           recs[i][0] = uint256(records[i].to);
           recs[i][1] = uint256(records[i].input);
           recs[i][2] = uint256(records[i].output);
           recs[i][3] = records[i].amount0Out;
           recs[i][4] = records[i].amount1Out;
           recs[i][5] = records[i].timestamp;
      }
      return (recs);
    }
}
