workflow "Test, build, publish" {
  on = "push"
  resolves = ["Build"]
}

action "Test Less" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  args = "less:lint"
}

action "Test JS" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  needs = ["Test Less"]
  args = "test"
}

action "Build" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  needs = ["Test JS"]
  args = "build"
}
