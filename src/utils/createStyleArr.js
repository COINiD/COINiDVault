/**
 * Creates style Array
 */

export default createStyleArr = (style1, style2) => {
  let styleArr = [style1]

  if( style2 ) {
    if( Array.isArray(style2) ) {
      styleArr = styleArr.concat(style2)
    } else {
      styleArr.push(style2)
    }
  }

  return styleArr;
}