use std::fs;

#[derive(Clone, serde::Serialize)]
pub struct Payload {
  pub(crate) message: String,
}

pub fn read_file(file_path: &str) -> String {
  println!("In file {}", file_path);

  let contents = fs::read_to_string(file_path).expect("Should have been able to read the file");
  println!("File: {contents}");

  return contents;
}
