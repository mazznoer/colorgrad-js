use std::io::BufReader;

use wasm_bindgen::prelude::*;

pub fn set_panic_hook() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub struct Color(colorgrad::Color);

#[wasm_bindgen]
impl Color {
    pub fn parse(s: &str) -> Result<Color, js_sys::Error> {
        let col =
            colorgrad::Color::from_html(s).map_err(|e| js_sys::Error::new(&format!("{}", e)))?;
        Ok(Self(col))
    }

    pub fn rgba(&self) -> js_sys::Array {
        self.0.to_array().into_iter().map(JsValue::from).collect()
    }

    pub fn rgba8(&self) -> js_sys::Array {
        self.0.to_rgba8().into_iter().map(JsValue::from).collect()
    }

    pub fn rgba16(&self) -> js_sys::Array {
        self.0.to_rgba16().into_iter().map(JsValue::from).collect()
    }

    pub fn hsva(&self) -> js_sys::Array {
        let (h, s, v, a) = self.0.to_hsva();
        [h, s, v, a].into_iter().map(JsValue::from).collect()
    }

    pub fn hsla(&self) -> js_sys::Array {
        let (h, s, l, a) = self.0.to_hsla();
        [h, s, l, a].into_iter().map(JsValue::from).collect()
    }

    pub fn hwba(&self) -> js_sys::Array {
        let (h, w, b, a) = self.0.to_hwba();
        [h, w, b, a].into_iter().map(JsValue::from).collect()
    }

    pub fn hex(&self) -> String {
        self.0.to_hex_string()
    }

    #[wasm_bindgen(js_name = rgbString)]
    pub fn rgb_string(&self) -> String {
        self.0.to_rgb_string()
    }
}

#[wasm_bindgen]
pub struct Gradient(colorgrad::Gradient);

#[wasm_bindgen]
impl Gradient {
    pub fn domain(&self) -> js_sys::Array {
        let (dmin, dmax) = self.0.domain();
        let ar = js_sys::Array::new_with_length(2);
        ar.set(0, JsValue::from(dmin));
        ar.set(1, JsValue::from(dmax));
        ar
    }

    pub fn at(&self, t: f64) -> Color {
        Color(self.0.at(t))
    }

    #[wasm_bindgen(js_name = repeatAt)]
    pub fn repeat_at(&self, t: f64) -> Color {
        Color(self.0.repeat_at(t))
    }

    #[wasm_bindgen(js_name = reflectAt)]
    pub fn reflect_at(&self, t: f64) -> Color {
        Color(self.0.reflect_at(t))
    }

    pub fn colors(&self, n: u32) -> js_sys::Array {
        let ar = js_sys::Array::new_with_length(n);
        for (i, col) in self.0.colors(n as usize).into_iter().enumerate() {
            ar.set(i as u32, JsValue::from(Color(col)));
        }
        ar
    }

    pub fn sharp(&self, segment: u16, smoothness: f64) -> Gradient {
        Gradient(self.0.sharp(segment as usize, smoothness))
    }
}

#[wasm_bindgen]
pub fn rainbow() -> Gradient {
    Gradient(colorgrad::rainbow())
}

#[wasm_bindgen]
pub fn sinebow() -> Gradient {
    Gradient(colorgrad::sinebow())
}

#[wasm_bindgen]
pub fn turbo() -> Gradient {
    Gradient(colorgrad::turbo())
}

#[wasm_bindgen]
pub fn cividis() -> Gradient {
    Gradient(colorgrad::cividis())
}

#[wasm_bindgen(js_name = cubehelixDefault)]
pub fn cubehelix_default() -> Gradient {
    Gradient(colorgrad::cubehelix_default())
}

#[wasm_bindgen]
pub fn cool() -> Gradient {
    Gradient(colorgrad::cool())
}

#[wasm_bindgen]
pub fn warm() -> Gradient {
    Gradient(colorgrad::warm())
}

#[wasm_bindgen(js_name = customGradient)]
pub fn custom_gradient(
    colors: JsValue,
    domain: JsValue,
    mode: Option<String>,
    interpolation: Option<String>,
) -> Result<Gradient, js_sys::Error> {
    set_panic_hook();

    if colors.is_undefined() || colors.is_null() {
        return Err(js_sys::Error::new(&format!("colors not specified")));
    }

    let colors: Vec<String> = colors
        .into_serde()
        .map_err(|e| js_sys::Error::new(&format!("{}", e)))?;

    let mut gb = colorgrad::CustomGradient::new();
    let colors: Vec<&str> = colors.iter().map(|s| s as &str).collect();
    gb.html_colors(&colors);

    if !domain.is_undefined() && !domain.is_null() {
        let domain: Vec<f64> = domain
            .into_serde()
            .map_err(|e| js_sys::Error::new(&format!("{}", e)))?;
        gb.domain(&domain);
    }

    gb.mode(match mode.as_deref() {
        Some("rgb") => colorgrad::BlendMode::Rgb,
        Some("linear-rgb") => colorgrad::BlendMode::LinearRgb,
        Some("hsv") => colorgrad::BlendMode::Hsv,
        Some("oklab") => colorgrad::BlendMode::Oklab,
        Some(s) => return Err(js_sys::Error::new(&format!("invalid blend mode: {s}"))),
        _ => colorgrad::BlendMode::Rgb,
    });

    gb.interpolation(match interpolation.as_deref() {
        Some("linear") => colorgrad::Interpolation::Linear,
        Some("catmull-rom") => colorgrad::Interpolation::CatmullRom,
        Some("basis") => colorgrad::Interpolation::Basis,
        Some(s) => {
            return Err(js_sys::Error::new(&format!(
                "invalid interpolation mode: {s}"
            )))
        }
        _ => colorgrad::Interpolation::Linear,
    });

    let grad = gb
        .build()
        .map_err(|e| js_sys::Error::new(&format!("{}", e)))?;

    Ok(Gradient(grad))
}

#[wasm_bindgen(js_name = parseGGR)]
pub fn parse_ggr(
    ggr: String,
    foreground: Option<String>,
    background: Option<String>,
) -> Result<Gradient, js_sys::Error> {
    set_panic_hook();

    let fg = if let Some(s) = foreground {
        colorgrad::Color::from_html(s).map_err(|e| js_sys::Error::new(&format!("{}", e)))?
    } else {
        colorgrad::Color::new(0.0, 0.0, 0.0, 1.0)
    };

    let bg = if let Some(s) = background {
        colorgrad::Color::from_html(s).map_err(|e| js_sys::Error::new(&format!("{}", e)))?
    } else {
        colorgrad::Color::new(1.0, 1.0, 1.0, 1.0)
    };

    let (grad, _name) = colorgrad::parse_ggr(BufReader::new(ggr.as_bytes()), &fg, &bg)
        .map_err(|e| js_sys::Error::new(&format!("{}", e)))?;

    Ok(Gradient(grad))
}
