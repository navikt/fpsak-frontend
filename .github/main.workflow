workflow "Test, build, publish" {
  on = "push"
  resolves = ["Build"]
}

action "Install" {
  uses = "nuxt/actions-yarn@master"
  args = "install --ignore-scripts --no-progress"
}

action "Test Less" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install"]
  args = "less:lint"
}

action "Test JS" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Test Less"]
  args = "test"
}

action "Build" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Test JS"]
  args = "build"
}
