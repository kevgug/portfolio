<script lang="ts">
  export let name: string;
  export let size = "16px";
  export let color = "#000000";
  export let flipY = false;

  interface Icon {
    box: number;
    svg: string;
  }

  const defaultIcon: Icon = {
    box: 12,
    svg: ``,
  };

  const icons: Map<string, Icon> = new Map([
    [
      "arrow-down",
      {
        box: 24,
        svg: `<defs></defs><title>arrow-down</title><line x1="12" y1="0.75" x2="12" y2="23.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px"></line><polyline points="1.5 12.75 12 23.25 22.5 12.75" fill-rule="evenodd" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px"></polyline>`,
      },
    ],
    [
      "network-pin",
      {
        box: 24,
        svg: `<path stroke="currentColor" stroke-width="1.5" d="M18.75 16.1988C18.5429 16.1988 18.375 16.0309 18.375 15.8238C18.375 15.6166 18.5429 15.4488 18.75 15.4488"></path><path stroke="currentColor" stroke-width="1.5" d="M18.75 16.1988C18.9571 16.1988 19.125 16.0309 19.125 15.8238C19.125 15.6166 18.9571 15.4488 18.75 15.4488"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.75 11.3238C19.9435 11.3238 21.0881 11.7979 21.932 12.6418C22.7759 13.4857 23.25 14.6303 23.25 15.8238C23.25 17.7448 20.562 21.4008 19.341 22.9618C19.2709 23.0515 19.1812 23.1242 19.0788 23.1741C18.9764 23.224 18.8639 23.25 18.75 23.25C18.6361 23.25 18.5236 23.224 18.4212 23.1741C18.3188 23.1242 18.2291 23.0515 18.159 22.9618C16.938 21.3998 14.25 17.7448 14.25 15.8238C14.25 14.6303 14.7241 13.4857 15.568 12.6418C16.4119 11.7979 17.5565 11.3238 18.75 11.3238Z"></path><g><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.2491 23.0229C12.0708 23.4673 9.8096 23.2564 7.75105 22.4168C5.6925 21.5771 3.9289 20.1463 2.68289 18.3051C1.43689 16.4638 0.764367 14.2947 0.750228 12.0716C0.736088 9.84839 1.38097 7.67087 2.60345 5.81394C3.82593 3.95701 5.5712 2.50392 7.6189 1.63813C9.66659 0.772343 11.9249 0.532681 14.1087 0.949404C16.2925 1.36613 18.3039 2.42055 19.8889 3.97954C21.4739 5.53853 22.5614 7.53219 23.0142 9.7088"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.29231 22.9119C7.77099 20.6809 6.75444 16.6267 6.75444 11.9958C6.75444 7.36485 7.77099 3.31165 9.29231 1.07964"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M0.782089 11.2461H12.7518"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.0051 5.24879H20.9981"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.05453 17.2435H11.2524"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.7119 1.07964C16.007 3.26798 16.7956 5.71853 17.0199 8.25145"></path></g>`,
      },
    ],
    [
      "arrow-corner-right",
      {
        box: 24,
        svg: `<defs></defs><title>arrow-corner-right</title><line x1="4" y1="3.75" x2="19.91" y2="19.66" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px"></line><polyline points="4.91 19.66 19.91 19.66 19.91 4.66" fill-rule="evenodd" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px"></polyline>`,
      },
    ],
    [
      "house-entrance",
      {
        box: 24,
        svg: `<defs></defs><title>house-entrance</title><path d="M22.868,8.947,12,.747,1.122,8.947a1.177,1.177,0,0,0-.377.8V22.269a.981.981,0,0,0,.978.978H8.245V18a3.75,3.75,0,0,1,7.5,0v5.25h6.521a.982.982,0,0,0,.979-.978V9.747A1.181,1.181,0,0,0,22.868,8.947Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px"></path>`,
      },
    ],
    [
      "graduate-cap",
      {
        box: 24,
        svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-0.75 -0.75 24 24" height="24" width="24" id="Graduation-Cap--Streamline-Plump"><desc>Graduation Cap Streamline Icon: https://streamlinehq.com</desc><g id="Graduation-Cap--Streamline-Plump"><path id="Vector 2536" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m2.34375 8.4375 0 8.90625" stroke-width="1.5"></path><path id="Rectangle 1097" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M1.430625 7.76015625c-0.6478124999999999 -0.3103125 -0.6478124999999999 -1.1475 0 -1.4578125 0.849375 -0.406875 2.11828125 -0.984375 3.9131250000000004 -1.73203125 2.4937500000000004 -1.03875 4.1971875 -1.6546874999999999 5.11171875 -1.966875a2.4515625 2.4515625 0 0 1 1.5890625 0c0.9140625 0.3121875 2.6184375 0.928125 5.11171875 1.966875 1.7953125 0.74765625 3.0637499999999998 1.32515625 3.91359375 1.73203125 0.646875 0.3103125 0.646875 1.1475 0 1.4578125 -0.84984375 0.406875 -2.11875 0.984375 -3.91359375 1.73203125 -2.4937500000000004 1.03875 -4.1971875 1.6546874999999999 -5.11171875 1.966875a2.4515625 2.4515625 0 0 1 -1.5890625 0c-0.9140625 -0.3121875 -2.6184375 -0.928125 -5.11171875 -1.966875 -1.7953125 -0.748125 -3.0637499999999998 -1.32515625 -3.9131250000000004 -1.73203125Z" stroke-width="1.5"></path><path id="Subtract" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5.2040625 9.43359375A35.0840625 35.0840625 0 0 0 5.15625 11.3278125c0 1.4503125 0.07453125000000001 2.3610937499999998 0.14765625 2.90625 0.06421875 0.47625 0.33703125 0.88125 0.76265625 1.10390625C6.8896875 15.769218749999999 8.56171875 16.40625 11.25 16.40625c2.68828125 0 4.3603125 -0.6365625 5.1834375 -1.0678125 0.42562500000000003 -0.22265625 0.6984375 -0.62765625 0.76265625 -1.1034375 0.073125 -0.5456249999999999 0.14765625 -1.4564062500000001 0.14765625 -2.90625a35.0765625 35.0765625 0 0 0 -0.047812499999999994 -1.8946874999999999" stroke-width="1.5"></path><path id="Ellipse 20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3.75 18.75a1.40625 1.40625 0 1 1 -2.8125 0 1.40625 1.40625 0 1 1 2.8125 0" stroke-width="1.5"></path></g></svg>`,
      },
    ],
  ]);

  let displayIcon = icons.get(name) ?? defaultIcon;
</script>

<div style={flipY ? "transform: scaleY(-1);" : ""}>
  <svg
    class="duration-100 {$$props.class}"
    style="color: {color}; a"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 {displayIcon.box} {displayIcon.box}"
  >
    {@html displayIcon.svg}
  </svg>
</div>
