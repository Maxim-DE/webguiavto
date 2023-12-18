import { PrependZeros } from "./utilites";

function time_ArrToStr(time_massive, fraction = 0) {

  let time_string = PrependZeros(time_massive[0], 2) + "-" +
    PrependZeros(time_massive[1], 2) + "-" +
    PrependZeros(time_massive[2], 2) + " " +
    PrependZeros(time_massive[3], 2) + ":" +
    PrependZeros(time_massive[4], 2) + ":" +
    PrependZeros(time_massive[5], 2);
  
  if (fraction > 0 && time_massive[6]) { 
    time_string += `.${PrependZeros(time_massive[6], 6)}`  // если указана разрядность дробной части секунд (fraction)
                                                           // и она больше нуля - добавляем
  }

  return time_string;
}

export default time_ArrToStr